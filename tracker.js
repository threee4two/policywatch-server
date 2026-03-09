(function() {
  var schoolId = new URLSearchParams(document.currentScript.src.split('?')[1]).get('id');
 var serverUrl = 'http://185.151.29.142:3000/track';

  function isDoc(href) {
    if (!href) return false;
    var l = href.toLowerCase();
    return l.indexOf('.pdf') > -1 || 
           l.indexOf('.doc') > -1 || 
           l.indexOf('.docx') > -1 ||
           l.indexOf('data:application/pdf') > -1;
  }

 function ping(link) {
    var data = {
      school_id: schoolId,
      document_url: link.href.indexOf('data:') === 0 ? 'embedded-pdf' : link.href,
      document_name: link.innerText.trim() || link.title || link.download || 'Policy Document',
      page_url: window.location.href,
      timestamp: new Date().toISOString()
    };
    fetch(serverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'omit'
    }).catch(function(){});
  }

  function attach() {
    document.querySelectorAll('a[href]').forEach(function(link) {
      if (isDoc(link.href)) link.addEventListener('click', function() { ping(link); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  new MutationObserver(function(mutations) {
    mutations.forEach(function(mut) {
      mut.addedNodes.forEach(function(node) {
        if (node.querySelectorAll) {
          node.querySelectorAll('a[href]').forEach(function(link) {
            if (isDoc(link.href)) link.addEventListener('click', function() { ping(link); });
          });
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });

})();
