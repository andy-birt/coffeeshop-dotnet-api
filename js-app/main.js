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
        </div>
      `).join('');
    });
});

function getAllBeanVarieties() {
  return fetch(getBeanUrl).then(resp => resp.json());
}

/***********************************
 * 
 * Other bean stuff
 * 
 */

const beanForm = document.getElementById("bean-form");

beanForm.addEventListener("submit", (e) => {
  
  // Submit request without page refresh
  e.preventDefault();
  
  const postBeanUrl = "https://localhost:44366/api/beanvariety/";

  const beanFormBody = {
    name: e.target[0].value,
    region: e.target[1].value,
    notes: e.target[2].value
  }

  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";

  postNewBeanVariety(postBeanUrl, beanFormBody).then(getAllBeanVarieties)
    .then(beanVarieties => {
    document.querySelector(".bean-varieties").innerHTML = beanVarieties.map( bv => `
      <div>
        <h3>${bv.name}</h3>
        <div>${bv.region}</div>
        ${
          bv.notes ? `<div>${bv.notes}</div>` : ''
        }
      </div>
    `).join('');
  });
});

function postNewBeanVariety(url, formBody) {
  return fetch(url, { 
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formBody)
  }).then(res => res.json());
}