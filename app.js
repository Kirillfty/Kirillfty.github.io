const { createApp } = Vue;

createApp({
    data() {
        return {
            currentView: 'products',
            profileTab: 'orders',
            showPayment: false,
            processingPayment: false,
            products: [],
            cartItems: [],
            userOrders: [],
            userProfile: {
                name: '',
                email: '',
                phone: '',
                address: ''
            },
            orderData: {
                fullName: '',
                address: '',
                phone: ''
            },
            paymentData: {
                cardNumber: '',
                expiry: '',
                cvv: ''
            },
            // В реальном приложении userId должен приходить с сервера после авторизации
            userId: 1
        }
    },
    computed: {
        cartTotal() {
            return this.cartItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
        },
        cartTotalItems() {
            return this.cartItems.reduce((total, item) => total + item.quantity, 0);
        }
    },
    async mounted() {
        await this.loadProducts();
        await this.loadCart();
        await this.loadUserProfile();
        await this.loadUserOrders();
    },
    methods: {
        async loadProducts() {
            this.products = await shopDB.getProducts();
        },

        async loadCart() {
            this.cartItems = await shopDB.getCart(this.userId);
        },

        async loadUserProfile() {
            this.userProfile = await shopDB.getUserProfile(this.userId);
            // Заполняем данные для заказа из профиля
            this.orderData.fullName = this.userProfile.name;
            this.orderData.phone = this.userProfile.phone;
            this.orderData.address = this.userProfile.address;
        },

        async loadUserOrders() {
            this.userOrders = await shopDB.getUserOrders(this.userId);
        },

        async addToCart(product) {
            const existingItem = this.cartItems.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cartItems.push({
                    ...product,
                    quantity: 1
                });
            }

            await this.saveCart();
        },

        async removeFromCart(item) {
            this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
            await this.saveCart();
        },

        async updateQuantity(item, change) {
            const newQuantity = item.quantity + change;
            if (newQuantity > 0) {
                item.quantity = newQuantity;
                await this.saveCart();
            }
        },

        async updateCartItem(item) {
            if (item.quantity < 1) {
                item.quantity = 1;
            }
            await this.saveCart();
        },

        async saveCart() {
            await shopDB.saveCart(this.userId, this.cartItems);
        },

        async processPayment() {
            this.processingPayment = true;

            try {
                // Имитация обработки платежа
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Создаем заказ
                const order = await shopDB.createOrder({
                    user_id: this.userId,
                    items: this.cartItems,
                    total_amount: this.cartTotal,
                    shipping_address: this.orderData.address,
                    customer_name: this.orderData.fullName,
                    customer_phone: this.orderData.phone,
                    payment_method: 'card'
                });

                // Очищаем корзину
                this.cartItems = [];
                await this.saveCart();

                // Показываем сообщение об успехе
                alert(`Заказ #${order.id} успешно оформлен! Сумма: ${this.cartTotal} ₽`);

                // Сбрасываем формы
                this.showPayment = false;
                this.orderData = {
                    fullName: this.userProfile.name,
                    address: this.userProfile.address,
                    phone: this.userProfile.phone
                };
                this.paymentData = {
                    cardNumber: '',
                    expiry: '',
                    cvv: ''
                };

                // Обновляем список заказов
                await this.loadUserOrders();

                // Переходим в личный кабинет
                this.currentView = 'profile';
                this.profileTab = 'orders';

            } catch (error) {
                alert('Ошибка при обработке платежа: ' + error.message);
            } finally {
                this.processingPayment = false;
            }
        },

        async updateProfile() {
            await shopDB.updateUserProfile(this.userId, this.userProfile);
            alert('Профиль успешно обновлен!');
        }
    }
}).mount('#app');