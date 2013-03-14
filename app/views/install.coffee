
# Install View
class Nodejs.Views.Install extends KDView

  constructor:->
    super
    
    @kc         = KD.getSingleton "kiteController"
    {@nickname} = KD.whoami().profile
    
    @listenWindowResize()
    
    @form = new KDFormViewWithFields
      callback            : @submit.bind(@)
      buttons             :
        install           :
          title           : "Install/Activate"
          style           : "cupid-green"
          type            : "submit"
          loader          :
            color         : "#444444"
            diameter      : 12
      fields              :
        version           :
          label           : "Version:"
          name            : "version"
          itemClass       : KDSelectBox
          selectOptions   : [
                              { title: "v0.8.22", value: "v0.8.22" }
                              { title: "v0.10.0", value: "v0.10.0" }
                            ]
          defaultValue    : "v0.8.22"

        status            :
          label           : "Installation Status:"
          name            : "status"

  submit:(formData)=>

    {version} = formData

    self = @
    model = new Nodejs.Models.Install app.console
    model.activate version, ->
      self.form.buttons["Install/Activate"].hideLoader()

  viewAppended:->
    
    super
    
    @addSubView @form