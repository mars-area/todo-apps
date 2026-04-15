import { type UsersRepository } from "../repositories/usersRepository";

// Define what the service needs to function
interface UsersServiceDeps {
  usersRepo: UsersRepository;
}

export const createUsersService = ({ usersRepo }: UsersServiceDeps) => {
  return {
    createUser: async (user: { name: string; email: string; password: string }) => {
      const newUser = await usersRepo.create({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      return newUser.get();
    },
    updateUserToken: async (id: number, token: string) => {
      return await usersRepo.update(id, { token });
    },
    getUserByToken: async (token: string) => {
      const user = await usersRepo.findOne({ where: { token } });
      if (!user) return null;
      return user.get()
    },
    getUserDataByEmail: async (email: string) => {
      const user = await usersRepo.findUserByEmail(email);
      if (!user) return null;
      return user.get();
    },
    getUserDetails: async (id: number) => {
      const user = await usersRepo.findUserDetails(id);
      if (!user) return null;
      return user.get();
    },
    getUserById: async (id: number) => {
      const user = await usersRepo.findById(id);
      if (!user) return null;
      return user.get();
    },
  };
};
