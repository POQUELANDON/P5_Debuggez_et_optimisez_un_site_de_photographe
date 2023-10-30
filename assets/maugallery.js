function mauGallery(userOptions) {
  var options = Object.assign({}, mauGallery.defaults, userOptions);
  var tagsCollection = [];

  var galleryItems = document.querySelectorAll('.gallery');
  galleryItems.forEach(function (item) {
    createRowWrapper(item);

    if (options.lightBox) {
      createLightBox(item, options.lightboxId, options.navigation);
    }

    listeners(options);

    var galleryItemElements = item.querySelectorAll('.gallery-item');
    galleryItemElements.forEach(function (element, index) {
      responsiveImageItem(element);
      moveItemInRowWrapper(element);
      wrapItemInColumn(element, options.columns);

      var theTag = element.dataset['gallery-tag'];
      if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
        tagsCollection.push(theTag);
      }
    });

    if (options.showTags) {
      showItemTags(item, options.tagsPosition, tagsCollection);
    }

    item.style.display = 'block';
  });
}

mauGallery.defaults = {
  columns: 3,
  lightBox: true,
  lightboxId: null,
  showTags: true,
  tagsPosition: "bottom",
  navigation: true
};

function listeners(options) {
  var galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      if (options.lightBox && item.tagName === 'IMG') {
        openLightBox(item, options.lightboxId);
      }
    });
  });

  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('nav-link')) {
      filterByTag(event);
    }
  });

  var prevButton = document.querySelector('.mg-prev');
  if (prevButton) {
    prevButton.addEventListener('click', function () {
      prevImage(options.lightboxId);
    });
  }

  var nextButton = document.querySelector('.mg-next');
  if (nextButton) {
    nextButton.addEventListener('click', function () {
      nextImage(options.lightboxId);
    });
  }
}

function createRowWrapper(element) {
  if (!element.querySelector('.row')) {
    var rowWrapper = document.createElement('div');
    rowWrapper.className = 'gallery-items-row row';
    element.appendChild(rowWrapper);
  }
}

function wrapItemInColumn(element, columns) {
  if (typeof columns === 'number') {
    var columnClasses = 'item-column mb-4 col-' + Math.ceil(12 / columns);
    var columnWrapper = document.createElement('div');
    columnWrapper.className = columnClasses;
    element.parentElement.insertBefore(columnWrapper, element);
    columnWrapper.appendChild(element);
  } else if (typeof columns === 'object') {
    var columnClasses = '';
    if (columns.xs) {
      columnClasses += ' col-' + Math.ceil(12 / columns.xs);
    }
    if (columns.sm) {
      columnClasses += ' col-sm-' + Math.ceil(12 / columns.sm);
    }
    if (columns.md) {
      columnClasses += ' col-md-' + Math.ceil(12 / columns.md);
    }
    if (columns.lg) {
      columnClasses += ' col-lg-' + Math.ceil(12 / columns.lg);
    }
    if (columns.xl) {
      columnClasses += ' col-xl-' + Math.ceil(12 / columns.xl);
    }
    var columnWrapper = document.createElement('div');
    columnWrapper.className = 'item-column mb-4' + columnClasses;
    element.parentElement.insertBefore(columnWrapper, element);
    columnWrapper.appendChild(element);
  } else {
    console.error('Columns should be defined as numbers or objects. ' + typeof columns + ' is not supported.');
  }
}

function moveItemInRowWrapper(element) {
  var rowWrapper = element.closest('.gallery-items-row');
  if (rowWrapper) {
    rowWrapper.appendChild(element);
  } else {
    console.error("Row wrapper not found for the element.");
  }
}

function responsiveImageItem(element) {
  if (element.tagName === 'IMG') {
    element.classList.add('img-fluid');
  }
}

function openLightBox(element, lightboxId) {
  var lightbox = document.querySelector('#' + (lightboxId ? lightboxId : 'galleryLightbox'));
  var lightboxImage = lightbox.querySelector('.lightboxImage');
  lightboxImage.src = element.src;
  lightbox.style.display = 'block';
}

function prevImage(lightboxId) {
  var activeImage = document.querySelector('.lightboxImage').src;
  var images = document.querySelectorAll('img.gallery-item');
  var activeTag = document.querySelector('.tags-bar span.active-tag').dataset['images-toggle'];
  var imagesCollection = [];

  if (activeTag === 'all') {
    var itemColumns = document.querySelectorAll('.item-column');
    itemColumns.forEach(function (item) {
      var img = item.querySelector('img');
      if (img) {
        imagesCollection.push(img);
      }
    });
  } else {
    var itemColumns = document.querySelectorAll('.item-column');
    itemColumns.forEach(function (item) {
      var img = item.querySelector('img');
      if (img && img.dataset['gallery-tag'] === activeTag) {
        imagesCollection.push(img);
      }
    });
  }

  var index = 0;
  var prev = null;
  imagesCollection.forEach(function (img, i) {
    if (img.src === activeImage) {
      index = i;
    }
  });

  prev = imagesCollection[index - 1];
  var lightboxImage = document.querySelector('.lightboxImage');
  if (prev) {
    lightboxImage.src = prev.src;
  }
}

function nextImage(lightboxId) {
  var activeImage = null;
  var images = document.querySelectorAll('img.gallery-item');
  images.forEach(function (img) {
    if (img.src === document.querySelector('.lightboxImage').src) {
      activeImage = img;
    }
  });

  var activeTag = document.querySelector('.tags-bar span.active-tag').dataset['images-toggle'];
  var imagesCollection = [];

  if (activeTag === 'all') {
    var itemColumns = document.querySelectorAll('.item-column');
    itemColumns.forEach(function (item) {
      var img = item.querySelector('img');
      if (img) {
        imagesCollection.push(img);
      }
    });
  } else {
    var itemColumns = document.querySelectorAll('.item-column');
    itemColumns.forEach(function (item) {
      var img = item.querySelector('img');
      if (img && img.dataset['gallery-tag'] === activeTag) {
        imagesCollection.push(img);
      }
    });
  }

  var index = 0;
  var next = null;
  imagesCollection.forEach(function (img, i) {
    if (img.src === activeImage.src) {
      index = i;
    }
  });

  next = imagesCollection[index + 1];
  var lightboxImage = document.querySelector('.lightboxImage');
  if (next) {
    lightboxImage.src = next.src;
  }
}

function createLightBox(gallery, lightboxId, navigation) {
  var lightboxIdValue = lightboxId ? lightboxId : 'galleryLightbox';
  var navigationHtml = navigation ?
    '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;">&lt;</div>' +
    '<img class="lightboxImage img-fluid alt="Contenu de l\'image affichée dans la modale au clique"/>' +
    '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">&gt;</div>' :
    '<span style="display:none;"/>';
  
  var lightboxHtml = 
    '<div class="modal fade" id="' + lightboxIdValue + '" tabindex="-1" role="dialog" aria-hidden="true">' +
      '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
          '<div class="modal-body">' +
            navigationHtml +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
    
  gallery.innerHTML += lightboxHtml;
}

function showItemTags(gallery, position, tags) {
  var tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
  tags.forEach(function (value) {
    tagItems += '<li class="nav-item active"><span class="nav-link" data-images-toggle="' + value + '">' + value + '</span></li>';
  });

  var tagsRow = '<ul class="my-4 tags-bar nav nav-pills">' + tagItems + '</ul>';
  if (position === 'bottom') {
    gallery.innerHTML += tagsRow;
  } else if (position === 'top') {
    gallery.innerHTML = tagsRow + gallery.innerHTML;
  } else {
    console.error('Unknown tags position: ' + position);
  }
}

function filterByTag(event) {
  var tag = event.target.dataset['images-toggle'];
  var activeTag = document.querySelector('.tags-bar span.active-tag');
  if (activeTag === event.target) {
    return;
  }

  activeTag.classList.remove('active', 'active-tag');
  event.target.classList.add('active-tag');

  var galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function (item) {
    var column = item.closest('.item-column');
    column.style.display = 'none';
  });

  if (tag === 'all') {
    var itemColumns = document.querySelectorAll('.item-column');
    itemColumns.forEach(function (item) {
      item.style.display = 'block';
    });
  } else {
    var itemColumns = document.querySelectorAll('.item-column');
    itemColumns.forEach(function (item) {
      var img = item.querySelector('img');
      if (img && img.dataset['gallery-tag'] === tag) {
        item.style.display = 'block';
      }
    });
  }
};