import User from "@/models/User";

export class UserRepository {
  static async findByEmail(email: string) {
    return await User.findOne({ email });
  }
  static async create(data: { 
    name: string;
     email: string; 
     password: string
     })
    {
    return await User.create(data);
  }
}
