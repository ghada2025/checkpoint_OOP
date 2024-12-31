class Product { // classe produit
    constructor(id, name, price) { // chaque produit a un id, un nom et un prix
        this.id = id;
        this.name = name;
        this.price = price;
    }
}
class ShoppingCartItem { // classe article du panier
    constructor(product, quantity) { // chaque article a un produit et une quantité
        this.product = product;
        this.quantity = quantity;
    }

    calculateTotal() { // fonction qui calcule le prix total
        return this.product.price * this.quantity; // on multiplie le prix du produit par la quantité
    }
}
class ShoppingCart { // classe panier
    constructor() {
        this.items = []; // liste des articles du panier on initialise avec une liste vide
    }

    addItem(product, quantity = 1) { // fonction qui ajoute un article au panier on ajoute un produit et une quantité
        const existingItem = this.items.find(item => item.product.id === product.id); // on cherche si le produit est deja dans le panier
        if (existingItem) { // si le produit est deja dans le panier
            existingItem.quantity += quantity; // on augmente la quantité
        } else { // sinon
            this.items.push(new ShoppingCartItem(product, quantity)); // on ajoute l'article au panier grace a la classe ShoppingCartItem et push 
        }
    }

    removeItem(productId) { // fonction qui supprime un article du panier
        this.items = this.items.filter(item => item.product.id !== productId); // on supprime l'article grace a la fonction filter
    }

    getTotal() { // fonction qui calcule le prix total
        return this.items.reduce((total, item) => total + item.calculateTotal(), 0); // on calcule le prix total grace a la fonction reduce 
        // reduce prend 3 arguments : le total, l'article et la quantité de l'article et on ajoute le prix de l'article au total grace a la fonction calculateTotal
    }

    displayItems() {
        return this.items.map(item => ({ // on mappe les articles du panier
            name: item.product.name, // on recupere le nom du produit
            quantity: item.quantity, // on recupere la quantité
            total: item.calculateTotal().toFixed(2) // on recupere le prix total
        }));
    }
}

class Cart {
    constructor() {
        this.buttonIncrement = document.querySelectorAll(".imgCounter img:nth-child(1)");//boutons "+" 
        this.buttonDecrement = document.querySelectorAll(".imgCounter img:nth-child(3)");//boutons "-"
        this.counters = document.querySelectorAll(".counter");//<span class="counter text-black-500 text-[30px]">0</span> *3 NODELIST
        this.deleteArticle = document.querySelectorAll(".deleteArticle"); // <div class="deleteArticle favoriteArticle flex flex-col  w-[400px] h-[670px] border border-[#e3e3e3] px-5 pb-10" > Article 1 </div>
        this.deleteArticleButton = document.querySelectorAll(".deleteArticleButton img:nth-child(1)"); // bouton "supprimer"
        this.favoriteArticle = document.querySelectorAll(".favoriteArticleButton img:nth-child(3)");// bouton "favorite" NOIR
        this.favoriteArticleButton = document.querySelectorAll(".favoriteArticleButton img:nth-child(2)");// bouton "favorite" BLANC
        this.total = document.querySelector(".total"); // total <span class="total font-bold text-black-500 text-[20px]"> 0 $ </span>
        this.price = document.querySelectorAll(".price"); // <h2 class="price text-black font-bold text-[30px] mt-8">50</h2> exemple 

        this.cart = new ShoppingCart(); // on créer un panier
        this.products = this.initializeProducts();// on appelle la fonction qui initialise les produits

        this.init();
    }

    initializeProducts() {
        const products = [];
        this.price.forEach((priceElement, index) => {
            const id = index + 1;
            const name = `Product ${id}`;
            const price = parseFloat(priceElement.innerHTML);
            products.push(new Product(id, name, price));
        });
        return products;
    }

    init() {
        this.initializeCounters(); // on appelle la fonction qui initialise les compteurs
        this.setupCounterListeners(); // on appelle la fonction qui setup les listeners (boutons "+" et "-") decrimentant et incrimentant le compteur
        this.setupDeleteListeners(); // on appelle la fonction qui setup les listeners (boutons "supprimer") supprimant un article
        this.setupFavoriteListeners(); // on appelle la fonction qui setup les listeners (boutons "favorite") favorisant un article
        this.calculateTotal(); // on appelle la fonction qui calcule le prix total
    }

    initializeCounters() {
        this.counters.forEach(counterElement => { // on parcourt tous les compteurs grace au forEach
            counterElement.innerHTML = "0"; // init to 0
        });
    }

    setupCounterListeners() {
        this.counters.forEach((counterElement, index) => { 
            this.buttonIncrement[index].addEventListener("click", () => { 
                this.incrementCounter(counterElement);
                this.cart.addItem(this.products[index], 1);
                this.calculateTotal(); // recalculate total
            });
    
            this.buttonDecrement[index].addEventListener("click", () => { 
                let count = parseInt(counterElement.innerHTML); // on récupère la valeur actuelle du compteur
                if (count > 0) { // si le compteur est plus grand que 0
                    this.decrementCounter(counterElement); 
                    this.cart.addItem(this.products[index], -1);
                    this.calculateTotal(); // recalculate total
                }
            });
        });
    }

    incrementCounter(counterElement) {
        let count = parseInt(counterElement.innerHTML);//on récupère la valeur actuelle du compteur ParseInt() convertit une chaîne de caractères en un nombre 
        counterElement.innerHTML = ++count; // on incrémente le compteur
        
    }

    decrementCounter(counterElement) {
        let count = parseInt(counterElement.innerHTML); // on récupère la valeur actuelle du compteur
        counterElement.innerHTML = Math.max(0, --count); // on decremente le compteur mais ne passe pas moins de 0
    }

    setupDeleteListeners() {
        this.deleteArticleButton.forEach((button, index) => { // on parcourt tous les boutons grace au forEach
            button.addEventListener("click", () => {
                this.deleteArticle[index].style.display = "none"; // on cache l'article
                this.counters[index].innerHTML = "0"; // on remet le compteur à 0
                this.cart.removeItem(this.products[index].id);
                this.calculateTotal(); // on recalcul le prix total
            });
        });
    }

    setupFavoriteListeners() {
        this.favoriteArticleButton.forEach((button, index) => { // on parcourt tous les boutons grace au forEach
            button.addEventListener("click", () => { // quand on clique sur le bouton "favorite" BLANC
                this.toggleFavorite(index, true); // si isFavorite = true alors on affiche le bouton "favorite" NOIR display:block et on cache le bouton "favorite" BLANC display:none
            });
        });

        this.favoriteArticle.forEach((button, index) => { // lorsque l'on clique sur le bouton "favorite" NOIR
            button.addEventListener("click", () => {
                this.toggleFavorite(index, false);// si isFavorite = false alors on affiche le bouton "favorite" BLANC display:block et on cache le bouton "favorite" NOIR display:none
            });
        });
    }

    toggleFavorite(index, isFavorite) { // idex = index de l'article et isFavorite = true ou false
        this.favoriteArticle[index].style.display = isFavorite ? "block" : "none";
        this.favoriteArticleButton[index].style.display = isFavorite ? "none" : "block";
    }

    
    calculateTotal() {
        
            const totalPrice = this.cart.getTotal();
            this.total.innerHTML = totalPrice.toFixed(2) + " $";
        
    }
    
}

// Initialize the cart functionality
new Cart();

// creer  un nouveau produit
const product1 = new Product(1, "Laptop", 1200.99);
const product2 = new Product(2, "Phone", 799.49);
console.log(product1, product2);
// creer un panier
const myCart = new ShoppingCart();
// ajouter un produit au panier
myCart.addItem(product1, 2); // on ajouter 2 laptops
myCart.addItem(product2, 1); // on ajouter 1 téléphone
console.log(myCart.displayItems()); // on affiche les éléments du panier n'est pas dans tableau car on affiche les éléments du panier
//afficher les éléments du panier
console.table(myCart.displayItems()); // Affiche les détails des articles
// supprimer un produit
myCart.removeItem(1); // supprime le produit avec id = 1
console.table(myCart.displayItems()); // miss à jour les articles du panier
// afficher le prix total
console.log("Total:", myCart.getTotal().toFixed(2) + " $");
