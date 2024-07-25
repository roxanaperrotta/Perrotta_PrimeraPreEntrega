import fs from "fs/promises";

import ProductManager from "./productManager.js"
const productManager = new ProductManager ();



class CartManager{
    constructor (){
        this.filepath = "carts.json";
        this.carts = [];

    };

    async addCart(){
        this.getCarts();
        const newCart={
            id:this.carts.length + 1,
            products: []
        };

        this.carts.push (newCart);

        try{
            await fs.promises.writeFile(this.filePath, JSON.stringify(this.carts))
            console.log("Carrito guardado");
            return newCart;

        }catch(error){
        return("Error guardando el carrito", error);
        };
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile (this.filePath, "utf8");
            this.carts = JSON.parse (data);
            return this.carts;
        } catch (error) {
            console.error('Error reading or parsing the file:', error);

        };
    };



    async getCartById(cartId){
        this.getCarts();
        const cart= await this.carts.find (cart=> cart.id === cartId);

        if (cart){
            return cart;
        }else{
            return("No se encuentra el carrito")
        };
    };

     async addProduct (cartId, productId){
        try{
            this.getCarts();
            const cart = this.carts.find (cart=>cart.id===cartId)
            if (!cart){
                return(`Carrito con id ${cartId} no encontrado`);
            }
            const productoExistente = cart.products.find (product => product.id ===parseInt(productId));
            if (!productoExistente){
                const product = productManager.getProductById(productId);
                if(!product){
                   return("Producto no encontrado");
                };

                cart.products.push({
                    id:parseInt(productId),
                    quantity:1
                });
            }else{
                productoExistente.quantity++;

            };

            await fs.promises.writeFile(this.filePath, JSON.stringify(this.carts));
            return cart;
        }catch (error){
           return("Error al agregar el producto al carrito", error);
        }
     }

   async deleteProduct (cartId, productId){
    try {
       this.getCarts();
       const cart = this.carts.find (cart=>cart.id===cartId);
       if (!cart){
      return(`Carrito con id ${cartId} no encontrado`);
    } 

    const productIndex=cart.products.findIndex(product=>product.id===parseInt(productId));
    if (productIndex ===-1){
       return(`Producto con id ${productId} en el carrito con id ${cartId} no encontrado`);
    }

    const product= cart.products[productIndex];
    if (product.quantity >1){
        product.quantity--;
    }else{
        cart.products.splice(productIndex, 1);

    await fs.promises.writeFile(this.filePath, JSON.stringify(this.carts));
    return cart;
    }

    } catch (error) {
        return("Error eliminando el producto del carrito", error);
    };  
   };
};

const cartManager = new CartManager();

export default CartManager;