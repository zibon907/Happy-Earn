const Auth = {

    register(name, email, password) {

        let users = Storage.getUsers();

        email = email.trim().toLowerCase();

        const exists = users.find(u => u.email === email);

        if (exists) {
            return { success: false, message: "User already exists" };
        }

        const user = {
            id: Date.now(),
            name: name.trim(),
            email,
            password: password,
            wallet: 0
        };

        users.push(user);

        Storage.saveUsers(users);

        return { success: true, user };
    },

    login(email, password) {

        let users = Storage.getUsers();

        email = email.trim().toLowerCase();

        const user = users.find(u =>
            u.email === email && u.password === password
        );

        if (!user) {
            return { success: false, message: "Invalid email or password" };
        }

        Storage.setCurrentUser(user);

        return { success: true, user };
    }
};
