const sg = {
  scrollListners: [],
  scrollInitialized: false,
};

const registerScrollToView = (element, callback, allowNext, delay) => {
  
  sg.scrollListners.push({element, callback});
  
  if (!sg.scrollInitialized) {
    let scrolled = null;
    window.onscroll = () => {
      if (!scrolled) {
        scrolled = setTimeout(() => {
          const doneIndexes = [];
          sg.scrollListners.forEach((scrollListner, index) => {
            const { element, callback } = scrollListner;

            if (isScrollIntoView(element) && !allowNext) {
              doneIndexes.push(index);
            }

            callback(window.pageYOffset);
          });
          
          doneIndexes.forEach((index, doneIndex) => {
            sg.scrollListners.splice(doneIndex, 1);
          });
          
          scrolled = null;
        }, delay);
      }
    };
    sg.scrollInitialized = true;
  }
};

const unregisterScrollToView = (element, callback) => {
  sg.scrollListners = sg.scrollListners.filter(scrollListner => scrollListner.element !== element);
  return callback();
};

const isScrollIntoView = element => {
  const {top, right, bottom, left} = element.getBoundingClientRect();
  const html = document.documentElement;
  
  return top >= 0 && left >= 0 && bottom <= (window.innerHeight || html.clientHeight) && right <= (window.innerWidth || html.clientWidth);
};

export {registerScrollToView, unregisterScrollToView, isScrollIntoView};
