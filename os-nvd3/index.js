import angular from 'angular';
import template from './index.html';
import './index.less';

import OSNvd3Controller from './OSNvd3Controller';

/**
 * 静态展示图表组件
 * 不支持实时更新
 */
class Nvd3 {
  constructor() {
    this.restrict = 'E';
    this.template = template;
    this.scope = {
      /**
       * 参见 angular-nvd3
       * @readOnly
       * @type {Object}
       */
      options: '=',
      /**
       * 参见 angular-nvd3
       * @readOnly
       * @type {Object}
       */
      data: '=',
    };

    this.controller = OSNvd3Controller;
    this.controllerAs = 'osNvd3Ctrl';
    this.bindToController = true;
  }

  static directiveFactory() {
    return new Nvd3();
  }
}

export default angular
  .module('osNvd3', [])
  .directive('osNvd3', Nvd3.directiveFactory)
  .name;
