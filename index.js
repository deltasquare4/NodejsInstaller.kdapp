// Compiled by Koding Servers at Thu Mar 14 2013 09:58:06 GMT-0700 (PDT) in server time

(function() {

/* KDAPP STARTS */

/* BLOCK STARTS /Source: /Users/deltasquare4/Applications/NodejsInstaller.kdapp/app/settings.coffee */

var Nodejs;

Nodejs = {
  Models: {
    Install: null
  },
  Views: {
    Main: null,
    Install: null
  }
};


/* BLOCK ENDS */



/* BLOCK STARTS /Source: /Users/deltasquare4/Applications/NodejsInstaller.kdapp/app/models/install.coffee */


Nodejs.Models.Install = (function() {

  function Install(output) {
    this.kc = KD.getSingleton("kiteController");
    this.nickname = KD.whoami().profile.nickname;
    this.output = output;
    this.binDir = "/Users/" + this.nickname + "/bin/";
    this.libDir = "/Users/" + this.nickname + "/Library/";
    this.tmpDir = "/tmp";
  }

  Install.prototype.println = function(content) {
    var output;
    content += "<br />";
    output = this.output;
    output.setPartial(content);
    return output.utils.wait(100, function() {
      return output.scrollTo({
        top: output.getScrollHeight(),
        duration: 100
      });
    });
  };

  Install.prototype.getInstallationStatus = function(version, callback) {
    var command, nodePath;
    nodePath = "" + this.libDir + "node/" + version + "/bin/node";
    command = 'if [ -e "' + nodePath + '" ]; then echo "true"; else echo "false"; fi';
    this.println(command);
    return this.kc.run(command, callback);
  };

  Install.prototype.verifyPath = function(callback) {
    var commands, error, prioritizeHomeBinDir, self, success, writeProfile,
      _this = this;
    prioritizeHomeBinDir = 'export PATH="$HOME/bin:`echo -n $PATH | awk -v RS=: -v ORS=: \'$0 != "\'$1\'"\' | sed \'s/:$//\'`";\n';
    writeProfile = 'cat > ~/.profile<<EOF\n' + prioritizeHomeBinDir + 'EOF';
    commands = [[writeProfile, "Adding supporting functions..."], [null, "Finished."]];
    self = this;
    success = function() {
      return callback();
    };
    error = function() {
      return callback();
    };
    return this.executeCommands(commands, 0, success, error);
  };

  Install.prototype.install = function(version, buttonCb) {
    var commands, createSymlinks, dirname, downloadUrl, error, filename, installDir, self, success,
      _this = this;
    dirname = "node-" + version + "-linux-x64";
    filename = dirname + ".tar.gz";
    downloadUrl = ("http://nodejs.org/dist/" + version + "/") + filename;
    installDir = this.libDir + "node/";
    createSymlinks = "for exe in " + installDir + version + "/bin/*; do ln -sf $exe " + this.binDir + "; done";
    commands = [[null, "Starting installation of node " + version + "..."], ["mkdir -p " + installDir + "; mkdir -p " + this.binDir + ";", "Checking if installation path already exists..."], ["cd " + this.tmpDir + " && curl -O " + downloadUrl, "Downloading binaries..."], ["rm -rf " + installDir + version, "Cleaning up older installation..."], ["cd " + this.tmpDir + " && tar -C " + installDir + " -xzf " + filename + " && cd " + installDir + " && mv " + dirname + " " + version, "Extracting files..."], [createSymlinks, "Creating Symlinks..."], [null, "Done."]];
    self = this;
    success = function() {
      return _this.verifyPath(buttonCb);
    };
    error = function() {
      return _this.verifyPath(buttonCb);
    };
    return this.executeCommands(commands, 0, success, error);
  };

  Install.prototype.activate = function(version, buttonCb) {
    var handler,
      _this = this;
    handler = function(err, result) {
      var commands, createSymlinks, error, installDir, success;
      if (result.indexOf('false') !== -1) {
        return _this.install(version, buttonCb);
      } else {
        installDir = _this.libDir + "node/";
        createSymlinks = "for exe in " + installDir + version + "/bin/*; do ln -sf $exe " + _this.binDir + "; done";
        commands = [[createSymlinks, "Switching to version " + version], [null, "Done."]];
        success = function() {
          return _this.verifyPath(buttonCb);
        };
        error = function() {
          return _this.verifyPath(buttonCb);
        };
        return _this.executeCommands(commands, 0, success, error);
      }
    };
    return this.getInstallationStatus(version, handler);
  };

  Install.prototype.executeCommands = function(commands, index, success, error) {
    var command, self;
    command = commands[index];
    if (commands.length === index) {
      return success();
    } else {
      if (command[1] !== null) {
        this.println(command[1]);
      }
      if (command[0]) {
        self = this;
        return this.kc.run(command[0], function(err, res) {
          if (res && (err || self.debug === true)) {
            self.println(res);
          }
          if (err) {
            self.println(err.message);
            return error();
          } else {
            return self.executeCommands(commands, index + 1, success, error);
          }
        });
      } else {
        return this.executeCommands(commands, index + 1, success, error);
      }
    }
  };

  return Install;

})();


/* BLOCK ENDS */



/* BLOCK STARTS /Source: /Users/deltasquare4/Applications/NodejsInstaller.kdapp/app/views/install.coffee */

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Nodejs.Views.Install = (function(_super) {

  __extends(Install, _super);

  function Install() {
    this.submit = __bind(this.submit, this);
    Install.__super__.constructor.apply(this, arguments);
    this.kc = KD.getSingleton("kiteController");
    this.nickname = KD.whoami().profile.nickname;
    this.listenWindowResize();
    this.form = new KDFormViewWithFields({
      callback: this.submit.bind(this),
      buttons: {
        install: {
          title: "Install/Activate",
          style: "cupid-green",
          type: "submit",
          loader: {
            color: "#444444",
            diameter: 12
          }
        }
      },
      fields: {
        version: {
          label: "Version:",
          name: "version",
          itemClass: KDSelectBox,
          selectOptions: [
            {
              title: "v0.8.22",
              value: "v0.8.22"
            }, {
              title: "v0.10.0",
              value: "v0.10.0"
            }
          ],
          defaultValue: "v0.8.22"
        },
        status: {
          label: "Installation Status:",
          name: "status"
        }
      }
    });
  }

  Install.prototype.submit = function(formData) {
    var model, self, version;
    version = formData.version;
    self = this;
    model = new Nodejs.Models.Install(app.console);
    return model.activate(version, function() {
      return self.form.buttons["Install/Activate"].hideLoader();
    });
  };

  Install.prototype.viewAppended = function() {
    Install.__super__.viewAppended.apply(this, arguments);
    return this.addSubView(this.form);
  };

  return Install;

})(KDView);


/* BLOCK ENDS */



/* BLOCK STARTS /Source: /Users/deltasquare4/Applications/NodejsInstaller.kdapp/app/views/main.coffee */

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Nodejs.Views.Main = (function(_super) {

  __extends(Main, _super);

  function Main(options, data) {
    Main.__super__.constructor.apply(this, arguments);
    this.install = new Nodejs.Views.Install({
      cssClass: "nodejs-view-install"
    });
    this.console = new KDScrollView({
      tagName: "pre",
      cssClass: "terminal-screen"
    });
  }

  Main.prototype.viewAppended = function() {
    var header;
    Main.__super__.viewAppended.apply(this, arguments);
    this.addSubView(header = new KDHeaderView({
      type: "big",
      title: "Install/Activate Node.js Versions"
    }));
    this.addSubView(this.install);
    return this.addSubView(this.console);
  };

  return Main;

})(KDView);


/* BLOCK ENDS */



/* BLOCK STARTS /Source: /Users/deltasquare4/Applications/NodejsInstaller.kdapp/index.coffee */

var app;

app = null;

(function() {
  try {
    return appView.addSubView(app = new Nodejs.Views.Main({
      cssClass: "nodejs-installer"
    }));
  } catch (error) {
    return new KDNotificationView({
      title: error
    });
  }
})();


/* BLOCK ENDS */

/* KDAPP ENDS */

}).call();