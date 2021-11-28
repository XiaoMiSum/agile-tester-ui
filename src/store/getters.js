const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  count: state => state.minder.count,
  working: state => {
    return {
      saving: state.minder.working.saving,
      draging: state.minder.working.draging,
      editing: state.minder.working.editing
    }
  },
  config: state => {
    return {
      ctrlPanelMin: state.minder.config.ctrlPanelMin,
      ctrlPanelWidth: state.minder.config.ctrlPanelWidth,
      dividerWidth: state.minder.config.dividerWidth,
      defaultLang: state.minder.config.defaultLang,
      zoom: state.minder.config.zoom
    }
  },
  getMinder: state => state.minder.minder,
  getEditor: state => state.minder.editor

}
export default getters
