if (document.documentElement) {
  moreIcons();
} else {
  window.addEventListener("DOMContentLoaded", moreIcons);
}

function moreIcons() {
  setTimeout(function() {
    var bookmarkIcon = document.getElementById('bookmark-icon');
    var bookmarkURL = document.getElementById('bookmark-url').textContent;
    var re = /<link (.*)\/>$/gmi;
    var currentAlternative = -1;

    var xhr = new XMLHttpRequest({mozSystem:true});
    xhr.open('GET', bookmarkURL);
    xhr.onload = function() {
      if (xhr.status !== 200) {
        return;
      }

      var url = new URL(bookmarkURL);
      var matches = xhr.responseText.match(re);
      if (!matches) {
        return;
      }
      var candidates = [];
      matches.forEach(function(match) {
        var icon = isCandidate(match, url.origin);
        if (icon) {
          candidates.push(icon);
        }
      });

      if (candidates.length > 0) {
        bookmarkIcon.addEventListener('click', function() {
          if (currentAlternative === candidates.length || currentAlternative === -1) {
            currentAlternative = 0;
          }
          bookmarkIcon.style.backgroundImage = 'url("' + candidates[currentAlternative] + '")';
          currentAlternative++;
        });

        // Mutation observer to add the new data if we changed the icon
        var target = document.querySelector('[role="status"]');
        var observer = new MutationObserver(function(mutations) {
          // Save during the status display
          if (target.classList.contains('onviewport')) {
            observer.disconnect();
            if (currentAlternative === -1) {
              // We did not choose any other icon so leave quietly
              return;
            }
            navigator.getDataStores('bookmarks_store').then(stores => {
              var store = stores[0];
              store.get(bookmarkURL).then(bookmark => {
                if (!bookmark) {
                  return;
                }
                bookmark.icon = candidates[currentAlternative - 1];
                store.put(bookmark, bookmarkURL);
              })
            })
          }
        });
        var config = { attributes: true };
        observer.observe(target, config);
      }

    }
    xhr.send();

  }, 1000);

  function isCandidate(str, origin) {
    function matchAny(str) {
      var types = ['.icon', 'icon', 'image/png', 'image_src', 'apple'];
      for (var i=0; i< types.length; ++i) {
        if (str.indexOf(types[i]) !== -1) {
          return true;
        }
      }
      return false;
    }

    var re = /href="((?:\\.|[^"\\])*)"/i;
    if (matchAny(str)) {
      var match = str.match(re);
      if (match && match.length > 1) {
        if (match[1].indexOf('http') === 0) {
          return match[1];
        }
        return origin + '/' + match[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
