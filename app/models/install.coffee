class Nodejs.Models.Install
  constructor:(output)->
    
    @kc         = KD.getSingleton "kiteController"
    {@nickname} = KD.whoami().profile
    @output     = output
    @binDir     = "/Users/#{@nickname}/bin/"
    @libDir     = "/Users/#{@nickname}/Library/"
    @tmpDir     = "/tmp"
    
  println:(content)->
    
    content += "<br />"
    output = @output
    output.setPartial content
    output.utils.wait 100, ->
      output.scrollTo
        top      : output.getScrollHeight()
        duration : 100

  getInstallationStatus: (version, callback)->
      nodePath = "#{@libDir}node/#{version}/bin/node"
      command = 'if [ -e "' + nodePath + '" ]; then echo "true"; else echo "false"; fi'
      
      @println command
      @kc.run command, callback

  verifyPath: (callback)->
    prioritizeHomeBinDir = 'export PATH="$HOME/bin:`echo -n $PATH | awk -v RS=: -v ORS=: \'$0 != "\'$1\'"\' | sed \'s/:$//\'`";\n'
    writeProfile = 'cat > ~/.profile<<EOF\n' + prioritizeHomeBinDir + 'EOF'

    commands = [
      [writeProfile, "Adding supporting functions..."]
      [null, "Finished."]
    ]

    self = @
    success = =>
      
      callback()
    
    error = =>
      
      callback()
    
    @executeCommands commands, 0, success, error
  
  install:(version, buttonCb)->
    
    dirname = "node-#{version}-linux-x64"
    filename = dirname + ".tar.gz"
    downloadUrl = "http://nodejs.org/dist/#{version}/" + filename
    installDir = @libDir + "node/"
    
    createSymlinks = "for exe in #{installDir}#{version}/bin/*; do ln -sf $exe #{@binDir}; done"

    commands = [
      [null, "Starting installation of node #{version}..."]
      ["mkdir -p #{installDir}; mkdir -p #{@binDir};", "Checking if installation path already exists..."]
      ["cd #{@tmpDir} && curl -O #{downloadUrl}", "Downloading binaries..."]
      ["rm -rf #{installDir}#{version}", "Cleaning up older installation..."]
      ["cd #{@tmpDir} && tar -C #{installDir} -xzf #{filename} && cd #{installDir} && mv #{dirname} #{version}", "Extracting files..."]
      [createSymlinks, "Creating Symlinks..."]
      [null, "Done."]
    ]
    
    self = @
    success = =>
      
      @verifyPath(buttonCb)
    
    error = =>
      
      @verifyPath(buttonCb)
    
    @executeCommands commands, 0, success, error

  activate:(version, buttonCb)->

    handler = (err, result) =>
  
      if(result.indexOf('false') != -1)
        @install version, buttonCb

      else
        installDir = @libDir + "node/"    
        createSymlinks = "for exe in #{installDir}#{version}/bin/*; do ln -sf $exe #{@binDir}; done"

        commands = [
          [createSymlinks, "Switching to version #{version}"]
          [null, "Done."]
        ]
        
        success = =>
          @verifyPath(buttonCb)
        
        error = =>
          @verifyPath(buttonCb)

        @executeCommands commands, 0, success, error

    # Check if requested version exist and take appropriate action accordingly
    @getInstallationStatus version, handler

    
  executeCommands:(commands, index, success, error)->
    
    command = commands[index]
    if commands.length == index
      success()
    else
      @println command[1] if command[1] != null
      
      if command[0]
        
        self = @
        @kc.run command[0], (err, res)->
          self.println res if res and (err or self.debug == true)
          
          if err
            self.println err.message
            error()
          else
            self.executeCommands commands, index+1, success, error
      else
        @executeCommands commands, index+1, success, error
