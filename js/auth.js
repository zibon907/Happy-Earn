const AuthService = {

    register(userData){

        const users =
        StorageService.getUsers();

        const emailExists =
        users.find(
        user =>
        user.email === userData.email
        );

        if(emailExists){

            return{

                success:false,

                message:
                "Email already exists"

            };

        }

        users.push(userData);

        StorageService.saveUsers(users);

        return{

            success:true,

            message:
            "Account created successfully"

        };

    },

    login(email,password){

        const users =
        StorageService.getUsers();

        const user =
        users.find(
        item =>
        item.email === email &&
        item.password === password
        );

        if(!user){

            return{

                success:false,

                message:
                "Invalid credentials"

            };

        }

        StorageService
        .setCurrentUser(user);

        return{

            success:true,

            user:user

        };

    },

    logout(){

        StorageService.logout();

    },

    isLoggedIn(){

        return !!StorageService
        .getCurrentUser();

    },

    currentUser(){

        return StorageService
        .getCurrentUser();

    }

};
