import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/User.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { SellerProfile } from './schemas/SellerProfileSchema';
import { User } from './schemas/User.schema';
import { UpdateSellerProfileDto } from './dto/UpdateSellerProfile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SellerProfile.name)
    private sellerProfileModel: Model<SellerProfile>,
  ) {}

  async createUser({ sellerProfile, ...createUserDto }: CreateUserDto) {
    if (sellerProfile) {
      const newSettings = new this.sellerProfileModel(sellerProfile);
      const savedNewSettings = await newSettings.save();
      const newUser = new this.userModel({
        ...createUserDto,
        sellerProfile: savedNewSettings._id,
      });
      return newUser.save();
    }
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  getUsers() {
    return this.userModel.find().populate('sellerProfile');
  }

  getUserById(id: string) {
    return this.userModel.findById(id).populate('sellerProfile');
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }


  async updateSellerProfile(id: string, updateSellerProfileDto: UpdateSellerProfileDto) {
    const sellerProfile = await this.sellerProfileModel.findByIdAndUpdate(id, updateSellerProfileDto, { new: true });
    if (!sellerProfile) {
      throw new NotFoundException('Seller profile not found');
    }
    return sellerProfile;
  }


}
