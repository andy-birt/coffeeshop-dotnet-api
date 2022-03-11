/*****************
 * 
 * Get the BEANS!!!
 * 
 */

const getBeanUrl = "https://localhost:44366/api/beanvariety/";

const beanSelect = document.getElementById("bean-select");

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

      beanSelect.innerHTML = `<option value="0">Select a Bean</option>`;
      
      beanVarieties.forEach( bv => {
        const option = document.createElement('option');
        option.value = bv.id;
        option.textContent = bv.name;
        beanSelect.appendChild(option);
      });
      
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

      beanSelect.innerHTML = `<option value="0">Select a Bean</option>`;
      
      beanVarieties.forEach( bv => {
        const option = document.createElement('option');
        option.value = bv.id;
        option.textContent = bv.name;
        beanSelect.appendChild(option);
      });
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
              <a href="#" id="edit-beanVar-${bv.id}">Edit</a>
              <a href="#" id="delete-beanVar-${bv.id}">Delete</a>
            </div>
          </div>
        `).join('');

        beanSelect.innerHTML = `<option value="0">Select a Bean</option>`;
      
        beanVarieties.forEach( bv => {
          const option = document.createElement('option');
          option.value = bv.id;
          option.textContent = bv.name;
          beanSelect.appendChild(option);
        });
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

 const getCoffeeUrl = "https://localhost:44366/api/coffee/";

function getAllCoffee() {
  return fetch(getCoffeeUrl).then(res => res.json());
}

function createCoffee(url, formBody) {
  return fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formBody)
  }).then(getAllCoffee);
}

function editCoffee(url, formBody) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formBody)
  }).then(getAllCoffee);
}

function deleteCoffee(url) {
  return fetch(url, { method: 'DELETE' }).then(getAllCoffee);
}

/**
 * 
 * Great! Now let's use the coffee crud functions
 * 
 */



getAllBeanVarieties().then(bvs => {
  bvs.forEach( bv => {
    const option = document.createElement('option');
    option.value = bv.id;
    option.textContent = bv.name;
    beanSelect.appendChild(option);
  });
});

getAllCoffee()
.then(coffees => {
  document.querySelector(".coffees").innerHTML = coffees.map( coffee => `
    <div>
      <h3>${coffee.title}</h3>
      <div>${coffee.beanVariety.name}</div>
      <div>
        <a href="#" id="edit-coffee-${coffee.id}">Edit</a>
        <a href="#" id="delete-coffee-${coffee.id}">Delete</a>
      </div>
    </div>
  `).join('');
});

const coffeeForm = document.getElementById("coffee-form");

document.querySelector(".coffees").addEventListener("click", e => {
  
  // In the list of coffees there will be an edit option that will change the form when clicked
  if (e.target.id.startsWith("edit")){
    const [,,coffeeId] = e.target.id.split("-");
    const getCoffeeByIdUrl = getCoffeeUrl+coffeeId+"/";
    return fetch(getCoffeeByIdUrl)
    .then(res => res.json())
    .then(coffee => {
      coffeeForm[0].value = coffee.id;
      coffeeForm[1].value = coffee.title;
      coffeeForm[2].value = coffee.beanVarietyId;
      document.getElementById("create-coffee").id = "edit-coffee";
      document.getElementById("edit-coffee").value = "Edit";
    });
  }

  // There will also be a delete button which, upon confirming to delete, will delete the coffee.
  if (e.target.id.startsWith("delete")){
    if (confirm('Do you wish to delete this coffee?')){
      const [,,coffeeId] = e.target.id.split("-");
      const deleteCoffeeUrl = getCoffeeUrl+coffeeId+"/";
      deleteCoffee(deleteCoffeeUrl).then(coffees => {
        document.querySelector(".coffees").innerHTML = coffees.map( coffee => `
          <div>
            <h3>${coffee.title}</h3>
            <div>${coffee.beanVariety.name}</div>
            <div>
              <a href="#" id="edit-coffee-${coffee.id}">Edit</a>
              <a href="#" id="delete-coffee-${coffee.id}">Delete</a>
            </div>
          </div>
        `).join('');
      });
    }
  }
});

coffeeForm.addEventListener("submit", (e) => {
  
  // Submit request without page refresh
  e.preventDefault();
  
  // Yeah I know, it's the same as the get url
  const postCoffeeUrl = "https://localhost:44366/api/coffee/";

  const editCoffeeUrl = +e.target[0].value ? postCoffeeUrl+ +e.target[0].value+"/" : '';

  // Save all the form body data in an object for readability and maybe clarity
  const coffeeFormBody = {
    id: +e.target[0].value,
    title: e.target[1].value,
    beanVarietyId: +e.target[2].value
  };

  // Clear the fields
  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";

  // Update the COFFEE!
  // Then get all the coffees again and display them in a list
  // That is IF were editing an existing coffee 

  if (document.getElementById("edit-coffee")) {
    
    editCoffee(editCoffeeUrl, coffeeFormBody)
    .then(coffees => {
      document.querySelector(".coffees").innerHTML = coffees.map( coffee => `
        <div>
          <h3>${coffee.title}</h3>
          <div>${coffee.beanVariety.name}</div>
          <div>
            <a href="#" id="edit-coffee-${coffee.id}">Edit</a>
            <a href="#" id="delete-coffee-${coffee.id}">Delete</a>
          </div>
        </div>
      `).join('');
      document.getElementById("edit-coffee").value = "Save";
      document.getElementById("edit-coffee").id = "create-coffee";
    });
  }

  // Save the COFFEE!
  // Then get all the coffees again and display them in a list
  // That is IF were creating a new coffee 
  if (document.getElementById("create-coffee")) {
    createCoffee(postCoffeeUrl, coffeeFormBody)
      .then(coffees => {
      document.querySelector(".coffees").innerHTML = coffees.map( coffee => `
        <div>
          <h3>${coffee.title}</h3>
          <div>${coffee.beanVariety.name}</div>
          <div>
            <a href="#" id="edit-coffee-${coffee.id}">Edit</a>
            <a href="#" id="delete-coffee-${coffee.id}">Delete</a>
          </div>
        </div>
      `).join('');
    });
  }
});