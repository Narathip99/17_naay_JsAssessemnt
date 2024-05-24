/* ------------------ Get Elements by ID ------------------ */
const productForm = document.getElementById("productForm"); // catch form
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productImage = document.getElementById("productImage");
const addToCart = document.getElementById("addToCart");
const calTotalPrice = document.getElementById("calTotalPrice");
const totalPrice = document.getElementById("totalPrice");

const productDashboard = document.getElementById("productDashboard");
const showCart = document.getElementById("showCart");


/* ------------------ Archived product and save to local storage ------------------ */
const products = JSON.parse(localStorage.getItem("products")) || [];  // get data from local storage or create empty array
const cart = JSON.parse(localStorage.getItem("cart")) || [];  // get data from local storage or create empty array


/* ------------------ Display Products from Local Storage ------------------ */
displayProducts();
displayCart();


/* ------------------ Create Product ------------------ */
productForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page refresh
  
  const name = productName.value.trim(); // get value
  const price = productPrice.value.trim(); // get value
  const image = productImage.value.trim(); // get value and trim space

  // create object for archived product value
  const newProduct = { name, price, image };

  // validation // check product will be added
  if (!validation( products ,newProduct)) {
    return; // if validation is false. stop the function
  }

  // push object in array newProduct --> product
  products.push(newProduct);

  // save data in local storage
  localStorage.setItem("products", JSON.stringify(products));

  // call func displayProducts for display product when recived data input form
  displayProducts();

  productForm.reset();  // reset form
});

function validation( products ,newProduct) {
  // validate price is number and <= 0
  let price = parseFloat(newProduct.price); // convert string to number
  if(isNaN(price) || price <= 0) {
    alert("price must be a number and > 0");
    return false;
  }
  newProduct.price = price.toFixed(2); // covert to 2 decimal

  // validate imgUrl startWith http and https
  if(!newProduct.image.startsWith("http") && !newProduct.image.startsWith("https")) {
    alert("image url must start with http or https");
    return false;
  }

  // validate imgUrl endWith .jpg and .png
  if(!newProduct.image.endsWith(".jpg") && !newProduct.image.endsWith(".png")  && !newProduct.image.endsWith(".gif")) {
    alert("image url must end with .jpg or .png or .gif");
    return false;
  }

  // if product already exist call confirm
  if (products.some((products) => products.name === newProduct.name)) { // check if product already exist
    const confirmAdd = confirm("Product already exists. Do you want to add it?");
    if (!confirmAdd) {
      return false; // return false if confirmAdd is false
    }
  }
  return true;  // return true if product not exist
}

/* ------------------ Add to Cart ------------------ */
addToCart.addEventListener("click", () => {
  const checked = document.querySelectorAll("input[type=checkbox]:checked");  // use selector find input type-checkbox with checked

  // finally i select index by checkbox id checkbox-${index} and use split to get index
  checked.forEach((checkbox) => {
    const index = checkbox.id.split("-")[1];  // split is used for get index after "-" 
    cart.push(products[index]);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
  })
})

/* ------------------ Action Button ------------------ */
function deleteProduct(index) {
  products.splice(index, 1);  // delete product at index position from products array.
  
  localStorage.setItem("products", JSON.stringify(products));  // update local storage
  
  displayProducts();  // call func displayProducts for update productDashboard
}

function deleteFormCart(index) {
  cart.splice(index, 1);  // delete product at index position from cart array
  
  localStorage.setItem("cart", JSON.stringify(cart));  // update local storage
  
  displayCart();  // call func displayCart for update showCart
}

calTotalPrice.addEventListener("click", () => {
  let total = 0;

  cart.forEach((cart) => {
    total += parseFloat(cart.price);
  });

  totalPrice.innerText = "Total Price: $" + total;
})


/* ------------------ Function Display ------------------ */
function displayProducts() {
  productDashboard.innerHTML = "";  // empty the productDashboard // because when call a func again old data will be show. that why we need to empty it
  const fragment = document.createDocumentFragment(); // create fragment
  
  // loop every product in products with forEach
  // forEach will automatically generate index values.  // for example, product[0] index = 0
  products.forEach((product, index) => {   
    const productItem = document.createElement("div");
    productItem.classList.add("flex", "items-center", "gap-6", "p-6", "border-y-2");  // add class to div item
    
    // inner productItem such a checkbox, name, price, image and action button
    productItem.innerHTML = `
      <input id="checkbox-${index}" type="checkbox" class="checkbox border-4 rounded-full" />

      <img src="${product.image}" alt="${product.name}" class="max-h-[200px]"/>
      
      <div class="flex-1">
        <h3 class="text-xl font-semibold">${product.name}</h3>
        <p class="text-gray-800 font-medium">Price: $${product.price}</p>
      </div>
      
      <div class="flex gap-4">
        <button class="btn btn-warning" onclick="editProduct(${index})">Edit</button>
        <button 
          onclick="deleteProduct(${index})"
          class="btn btn-error"
        >
          Delete
        </button>
      </div>
    `;
    
    // okay we use fragment for doesn't make dom working hard
    fragment.appendChild(productItem);  // add productItem div into fragment
  });
  productDashboard.appendChild(fragment);  // add fragment into productDashboard
}

function displayCart() {
  showCart.innerHTML = "";  // empty the showCart
  const fragment = document.createDocumentFragment(); // create fragment

  // loop every product in cart
  cart.forEach((cart, index) => {
    const cartItem = document.createElement("div");  // create div item
    cartItem.classList.add("flex", "items-center", "gap-4", "p-6", "border-y-2");  // add class to div item
  
    // inner cartItem
    cartItem.innerHTML = `
      <img 
        src="${cart.image}" 
        alt="${cart.name}" 
        class="max-h-[200px]"
        />
      <div class="flex-1">
        <h3 class="text-xl font-semibold">${cart.name}</h3>
        <p class="text-gray-800 font-medium">Price: $${cart.price}</p>
        <button 
          onclick="deleteFormCart(${index})"  
        class="btn btn-error h-8 min-h-8 mt-2"
        >
          Delete
        </button>
      </div>
    `;
    fragment.appendChild(cartItem);  // add cartItem div into fragment
  });

  showCart.appendChild(fragment);  // add fragment into showCart
}