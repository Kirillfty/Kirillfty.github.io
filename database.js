class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        // В реальном приложении здесь был бы запрос к серверу с SQLite
        // Для демонстрации используем localStorage как имитацию базы данных
        if (!localStorage.getItem('shop_db_initialized')) {
            this.initializeDatabase();
        }
    }

    initializeDatabase() {
        // Инициализация продуктов
        const products = [
            {
                id: 1,
                name: 'Смартфон',
                description: 'Современный смартфон с отличной камерой',
                price: 29999,
                image: 'https://via.placeholder.com/300x200?text=Смартфон',
                stock: 10
            },
            {
                id: 2,
                name: 'Ноутбук',
                description: 'Мощный ноутбук для работы и игр',
                price: 79999,
                image: 'https://via.placeholder.com/300x200?text=Ноутбук',
                stock: 5
            },
            {
                id: 3,
                name: 'Наушники',
                description: 'Беспроводные наушники с шумоподавлением',
                price: 8999,
                image: 'https://via.placeholder.com/300x200?text=Наушники',
                stock: 15
            },
            {
                id: 4,
                name: 'Часы',
                description: 'Умные часы с фитнес-трекером',
                price: 15999,
                image: 'https://via.placeholder.com/300x200?text=Часы',
                stock: 8
            }
        ];

        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('orders', JSON.stringify([]));
        localStorage.setItem('users', JSON.stringify([]));
        localStorage.setItem('shop_db_initialized', 'true');
    }

    // Методы для работы с продуктами
    async getProducts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                resolve(products);
            }, 100);
        });
    }

    async getProduct(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    // Методы для работы с заказами
    async createOrder(orderData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                const newOrder = {
                    id: Date.now(),
                    ...orderData,
                    created_at: new Date().toISOString(),
                    status: 'обрабатывается'
                };
                orders.push(newOrder);
                localStorage.setItem('orders', JSON.stringify(orders));
                resolve(newOrder);
            }, 200);
        });
    }

    async getUserOrders(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                const userOrders = orders.filter(order => order.user_id === userId);
                resolve(userOrders);
            }, 100);
        });
    }

    // Методы для работы с пользователями
    async getUserProfile(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                let user = users.find(u => u.id === userId);
                if (!user) {
                    user = {
                        id: userId,
                        name: 'Пользователь',
                        email: '',
                        phone: '',
                        address: ''
                    };
                    users.push(user);
                    localStorage.setItem('users', JSON.stringify(users));
                }
                resolve(user);
            }, 100);
        });
    }

    async updateUserProfile(userId, profileData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = users.findIndex(u => u.id === userId);
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...profileData };
                    localStorage.setItem('users', JSON.stringify(users));
                    resolve(users[userIndex]);
                }
            }, 100);
        });
    }

    // Методы для работы с корзиной
    async getCart(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const cart = JSON.parse(localStorage.getItem(`cart_${userId}`) || '[]');
                resolve(cart);
            }, 50);
        });
    }

    async saveCart(userId, cartItems) {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
                resolve(true);
            }, 50);
        });
    }
}

// Создаем глобальный экземпляр базы данных
window.shopDB = new Database();