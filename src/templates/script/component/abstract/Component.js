export default class Component {

  _mount() {
  }

  _unmount() {
  }

  _interpolateTemplate(template, data) {
    let interpolatedTemplate = template;

    template
      .match(/{{\w+}}/g)
      .reduce((acc, val) => {
        if (!~acc.indexOf(val))
          acc.push(val);
        return acc;
      }, [])
      .forEach(param => {
        const value = data[param.replace(/{{|}}/g, '')];
        interpolatedTemplate = interpolatedTemplate.replace(new RegExp(param, 'g'), value);
      });

    return interpolatedTemplate;
  }

  _waitForStyle(element, style) {
    return window.getComputedStyle(element)[style];
  }
}
