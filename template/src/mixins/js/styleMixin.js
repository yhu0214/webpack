export default {
  methods: {
    getStyleValue(value) {
      const scale = '100vw / 1920';
      return `calc(${scale} * ${value})`;
    },
    findParentByTag(el, tag, className) {
      const cleanTag = tag.toUpperCase();
      let element = el;

      if (element.tagName === cleanTag) {
        return element;
      }

      while (element && element.parentNode) {
        element = element.parentNode;

        if (element.tagName && element.tagName === cleanTag) {
          if (className !== undefined) {
            if (element.classList.contains(className)) {
              return element;
            }
          } else {
            return element;
          }
        }
      }

      return null;
    },
    getTransform(element) {
      const transform = getComputedStyle(element).getPropertyValue('transform');
      const chunks = transform.split(',');
      const dimensions = {
        left: 0,
        top: 0,
        width: element.clientWidth,
        height: element.clientHeight,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
      };

      if (chunks.length > 1) {
        dimensions.left = Number(chunks[4]);
        dimensions.top = Number(chunks[5].substr(0, chunks[5].length - 1));
      }

      return dimensions;
    },
  },
};
