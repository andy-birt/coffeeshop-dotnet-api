/*****************
 * 
 * Get the BEANS!!!
 * 
 */

const getBeanUrl = "https://localhost:44366/api/beanvariety/";

const button = document.querySelector("#run-button");
button.addEventListener("click", () => {
  getAllBeanVarieties()
    .then(beanVarieties => {
      document.querySelector(".bean-varieties").innerHTML = beanVarieties.map( bv => `
        <div>
          <h3>${bv.name}</h3>
          <div>${bv.region}</div>
          ${
            bv.notes ? `<div>${bv.notes}</div>` : ''
          }
          <div>
            <a href="#" id="edit-beanVar-${bv.id}">Edit</a>
            <a href="#" id="delete-beanVar-${bv.id}">Delete</a>
          </div>
        </div>
      `).join('');
    });
});

// Fetch req to get all beans

function getAllBeanVarieties() {
  return fetch(getBeanUrl).then(resp => resp.json());
}

/***********************************
 * 
 * More Bean CRUD
 * 
 * Doesn't sound too good does it?
 * 
 */


// Get a reference to the bean form
const beanForm = document.getElementById("bean-form");

// This listener will trigger when submit button is clicked
beanForm.addEventListener("submit", (e) => {
  
  // Submit request without page refresh
  e.preventDefault();
  
  // Yeah I know, it's the same as the get url
  const postBeanUrl = "https://localhost:44366/api/beanvariety/";

  const editBeanUrl = +e.target[0].value ? postBeanUrl+ +e.target[0].value+"/" : '';

  // Save all the form body data in an object for readability and maybe clarity
  const beanFormBody = {
    id: +e.target[0].value,
    name: e.target[1].value,
    region: e.target[2].value,
    notes: e.target[3].value
  };

  // Clear the fields
  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";
  e.target[3].value = "";

  // Update the BEAN!
  // Then get all the beans again and display them in a list
  // That is IF were editing an existing bean 

  if (document.getElementById("edit-beanVar")) {
    
    editBeanVariety(editBeanUrl, beanFormBody)
    .then(beanVarieties => {
      document.querySelector(".bean-varieties").innerHTML = beanVarieties.map( bv => `
        <div>
          <h3>${bv.name}</h3>
          <div>${bv.region}</div>
          ${
            bv.notes ? `<div>${bv.notes}</div>` : ''
          }
          <div>
            <a id="edit-beanVar-${bv.id}">Edit</a>
            <a id="delete-beanVar-${bv.id}">Delete</a>
          </div>
        </div>
      `).join('');
      document.getElementById("edit-beanVar").value = "Save";
      document.getElementById("edit-beanVar").id = "create-beanVar";
    });
  }

  // Save the BEAN!
  // Then get all the beans again and display them in a list
  // That is IF were creating a new bean 
  if (document.getElementById("create-beanVar")) {
    postNewBeanVariety(postBeanUrl, beanFormBody)
      .then(beanVarieties => {
      document.querySelector(".bean-varieties").innerHTML = beanVarieties.map( bv => `
        <div>
          <h3>${bv.name}</h3>
          <div>${bv.region}</div>
          ${
            bv.notes ? `<div>${bv.notes}</div>` : ''
          }
          <div>
            <a id="edit-beanVar-${bv.id}">Edit</a>
            <a id="delete-beanVar-${bv.id}">Delete</a>
          </div>
        </div>
      `).join('');
    });
  }
});


document.querySelector(".bean-varieties").addEventListener("click", e => {
  
  // In the list of beans there will be an edit option that will change the form when clicked
  if (e.target.id.startsWith("edit")){
    const [,,beanVarId] = e.target.id.split("-");
    const getBeanByIdUrl = getBeanUrl+beanVarId+"/";
    return fetch(getBeanByIdUrl)
    .then(res => res.json())
    .then(beanVar => {
      beanForm[0].value = beanVar.id;
      beanForm[1].value = beanVar.name;
      beanForm[2].value = beanVar.region;
      beanForm[3].value = beanVar.notes;
      document.getElementById("create-beanVar").id = "edit-beanVar";
      document.getElementById("edit-beanVar").value = "Edit";
    });
  }

  // There will also be a delete button which, upon confirming to delete, will delete the bean.
  if (e.target.id.startsWith("delete")){
    if (confirm('Do you wish to delete this bean?')){
      const [,,beanVarId] = e.target.id.split("-");
      const deleteBeanUrl = getBeanUrl+beanVarId+"/";
      deleteBeanVariety(deleteBeanUrl).then(beanVarieties => {
        document.querySelector(".bean-varieties").innerHTML = beanVarieties.map( bv => `
          <div>
            <h3>${bv.name}</h3>
            <div>${bv.region}</div>
            ${
              bv.notes ? `<div>${bv.notes}</div>` : ''
            }
            <div>
              <a id="edit-beanVar-${bv.id}">Edit</a>
              <a id="delete-beanVar-${bv.id}">Delete</a>
            </div>
          </div>
        `).join('');
      });
    }
  }
});

// In the fetch when POSTing rather than GETting
// its important to include the second argument for the fetch to specify it's going to post rather than get
// also set the header and stringify form body to send to the server
// You might not have to use a then like I did but... I did
function postNewBeanVariety(url, formBody) {
  return fetch(url, { 
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formBody)
  }).then(getAllBeanVarieties);
}

function editBeanVariety(url, formBody) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formBody)
  }).then(getAllBeanVarieties);
}

function deleteBeanVariety(url) {
  return fetch(url, {
    method: 'DELETE'
  }).then(getAllBeanVarieties);
}

/**********************************
 * 
 * Coffee CRUD
 * 
 * It's not as bad as it sounds...
 * 
 */