const searches = window.location.search
  .replace(/^\?/, '')
  .split('&')
  .map(item => item.split('='));

const http = {
  query: {
    get(target) {
      // eslint-disable-next-line no-unused-vars
      const search = searches.find(([key, value]) => key === target);

      return search ? search[1] : undefined;
    },
  },
};

export default http;
