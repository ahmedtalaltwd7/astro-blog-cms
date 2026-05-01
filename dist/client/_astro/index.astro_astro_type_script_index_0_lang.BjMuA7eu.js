(()=>{const o=document.getElementById("posts-container"),a=document.getElementById("loading"),b=document.getElementById("empty-state"),g=document.getElementById("load-more-wrapper"),n=document.getElementById("load-more-btn"),u=document.getElementById("load-more-status"),h=document.getElementById("post-search"),M=document.getElementById("empty-title"),S=document.getElementById("empty-message");if(!o||!a||!b||!g||!n||!u||!h||!M||!S){console.error("Required DOM elements not found");return}let r=0;const p=6;let c=1,f=0,s="",x=!1,E;const T="astro-blog-post-list-state";"scrollRestoration"in history&&(history.scrollRestoration="manual");function C(){try{const e=JSON.parse(sessionStorage.getItem(T)||"null");return!e||typeof e!="object"?null:{currentPage:Math.max(0,Number(e.currentPage)||0),scrollY:Math.max(0,Number(e.scrollY)||0),searchTerm:String(e.searchTerm||""),pendingRestore:!!e.pendingRestore}}catch{return null}}function d(e=window.scrollY,t=!1){try{sessionStorage.setItem(T,JSON.stringify({currentPage:r,scrollY:e,searchTerm:s,pendingRestore:t}))}catch{}}function m(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function $(e){const t=String(e||"").replace(/^#+/,"").trim();return t?`
          <a href="/tags/${encodeURIComponent(t)}" class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200">
            #${m(t)}
          </a>
        `:""}function B(e){const t=e.thumbnail||e.image,i=m(e.title),y=m(e.description||"No description provided."),l=m(e.pubDate);return`
          <article class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            ${t?`<img src="${m(t)}" alt="${i}" class="w-full h-48 object-cover" />`:'<div class="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>'}
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-3">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                <time datetime="${l}">${l}</time>
              </div>
              <h2 class="text-xl font-bold text-gray-900 mb-3">
                <a href="/blog/${encodeURIComponent(e.slug)}" class="hover:text-blue-600">${i}</a>
              </h2>
              <p class="text-gray-600 mb-4">${y}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                ${(e.tags||[]).map($).join("")}
              </div>
              <a href="/blog/${encodeURIComponent(e.slug)}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                Read more
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </article>
        `}async function w(e,t=!1,i=p,y=e){if(!x){x=!0,b.classList.add("hidden"),g.classList.add("hidden"),t?(n.disabled=!0,n.textContent="Loading...",u.textContent="Loading more posts..."):(a.classList.remove("hidden"),o.innerHTML="",o.appendChild(a));try{const l=new URLSearchParams({page:e.toString(),limit:i.toString()});s&&l.set("search",s);const L=await fetch(`/api/list-posts?${l.toString()}`);if(!L.ok)throw new Error("Failed to fetch posts");const v=await L.json();if(a.classList.add("hidden"),a.parentElement===o&&o.removeChild(a),!t&&v.posts.length===0){r=0,c=1,f=0,M.textContent=s?"No matching blog posts":"No blog posts yet",S.textContent=s?"Try searching for a different blog title.":"Get started by creating your first blog post using the admin editor.",b.classList.remove("hidden"),d();return}const I=v.posts.map(B).join("");t?o.insertAdjacentHTML("beforeend",I):o.innerHTML=I,c=Math.max(1,Math.ceil(v.pagination.total/p)),f=v.pagination.total,r=Math.min(y,c);const P=Math.min(r*p,f);u.textContent=`Showing ${P} of ${f} posts.`,r<c&&(n.disabled=!1,n.textContent="Load More",g.classList.remove("hidden")),d()}catch(l){console.error("Error loading posts:",l),a.classList.add("hidden"),t?(n.disabled=!1,n.textContent="Load More",u.textContent="Failed to load more posts. Please try again.",g.classList.remove("hidden")):o.innerHTML='<p class="col-span-full text-center text-red-600">Failed to load posts. Please try again later.</p>'}finally{x=!1}}}n.addEventListener("click",()=>{r<c&&w(r+1,!0)}),o.addEventListener("click",e=>{const t=e.target.closest("a[href]");if(!t)return;const i=new URL(t.href,window.location.origin);i.origin===window.location.origin&&i.pathname.startsWith("/blog/")&&d(window.scrollY,!0)}),h.addEventListener("input",()=>{window.clearTimeout(E),E=window.setTimeout(()=>{s=h.value.trim(),w(1)},250)}),window.addEventListener("pagehide",()=>{const e=C();d(window.scrollY,!!e?.pendingRestore)}),window.addEventListener("pageshow",e=>{e.persisted&&d(window.scrollY,!1)});async function R(){const e=C();if(e?.pendingRestore){const t=Math.max(1,e.currentPage||1);s=e.searchTerm,h.value=s,await w(1,!1,t*p,t),requestAnimationFrame(()=>{window.scrollTo(0,e.scrollY),d(e.scrollY,!1)});return}await w(1)}R()})();
