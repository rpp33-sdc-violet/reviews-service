// import database here

module.exports = {
  reviews: {
    get: () => {
      console.log('in models reviews GET');
      return 'all reviews data';
    },
    post: () => {
      console.log('in models reviews POST');
      return 'reviews data posted';
    },
  },
  meta: {
    get: () => {
      console.log('in models meta GET');
      return 'metadata here';
    },
  },
  helpful: {
    put: () => {
      console.log('in models helpful PUT');
      return 'helpful vote inserted';
    },
  },
  report: {
    put: () => {
      console.log('in models report PUT');
      return 'reported';
    },
  },
};
