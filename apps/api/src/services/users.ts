import { type UsersRepository } from "../repositories/usersRepository";

// Define what the service needs to function
interface UsersServiceDeps {
  usersRepo: UsersRepository;
}

export const createUsersService = ({ usersRepo }: UsersServiceDeps) => {
  return {
    getUserToken: async (id: number) => {
      const user = await usersRepo.findById(id);
      if (!user) return null;
      return user.get().token;
    },
    updateUserToken: async (id: number, token: string) => {
      return await usersRepo.update(id, { token });
    },
    getUserDataByEmail: async (email: string) => {
      const user = await usersRepo.findUserByEmail(email);
      if (!user) return null;
      return user.get();
    },
    getUserDetails: async (uid: string) => {
      const user = await usersRepo.findUserDetails(uid);
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
