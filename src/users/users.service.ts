import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/User.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { SellerProfile } from './schemas/SellerProfileSchema';
import { User } from './schemas/User.schema';
import { UpdateSellerProfileDto } from './dto/UpdateSellerProfile.dto';
import { CollaboratorProfile } from './schemas/CollaboratorProfileSchema';
import { UpdateCollaboratorProfileDto } from './dto/UpdateCollaboratorProfile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SellerProfile.name)
    private sellerProfileModel: Model<SellerProfile>,
    @InjectModel(CollaboratorProfile.name)
    private collaboratorProfileModel: Model<CollaboratorProfile>,
  ) {}

  // async createUser({ sellerProfile, ...createUserDto }: CreateUserDto) {
  //   if (sellerProfile) {
  //     const newSettings = new this.sellerProfileModel(sellerProfile);
  //     const savedNewSettings = await newSettings.save();
  //     const newUser = new this.userModel({
  //       ...createUserDto,
  //       sellerProfile: savedNewSettings._id,
  //     });
  //     return newUser.save();
  //   }
  //   const newUser = new this.userModel(createUserDto);
  //   return newUser.save();
  // }

  async createUser({
    sellerProfile,
    collaboratorProfile,
    ...createUserDto
  }: CreateUserDto) {
    let sellerProfileId;
    let collaboratorProfileId;

    if (sellerProfile) {
      const newSellerProfile = new this.sellerProfileModel(sellerProfile);
      const savedSellerProfile = await newSellerProfile.save();
      sellerProfileId = savedSellerProfile._id;
    }

    if (collaboratorProfile) {
      const newCollaboratorProfile = new this.collaboratorProfileModel(
        collaboratorProfile,
      );
      const savedCollaboratorProfile = await newCollaboratorProfile.save();
      collaboratorProfileId = savedCollaboratorProfile._id;
    }

    const newUser = new this.userModel({
      ...createUserDto,
      ...(sellerProfileId && { sellerProfile: sellerProfileId }),
      ...(collaboratorProfileId && {
        collaboratorProfile: collaboratorProfileId,
      }),
    });

    return newUser.save();
  }

  getUsers() {
    return this.userModel
      .find()
      .select('-password -__v')
      .populate({
        path: 'sellerProfile',
        select: '-__v',
      })
      .populate({
        path: 'collaboratorProfile',
        select: '-__v',
      });
  }
  // async getUsers() {
  //   return this.userModel.aggregate([
  //     {
  //       $lookup: {
  //         from: 'sellerprofiles',
  //         localField: 'sellerProfile',
  //         foreignField: '_id',
  //         as: 'sellerProfileDetails'
  //       }
  //     },
  //     {
  //       $unwind: '$sellerProfileDetails'
  //     },
  //     {
  //       $project: {
  //         username: 1,
  //         firstName: 1,
  //         lastName: 1,
  //         email: 1,
  //         phone: 1,
  //         userRole: 1,
  //         sellerProfile: '$sellerProfileDetails'
  //       }
  //     }
  //   ]);
  // }

  getUserById(id: string) {
    return this.userModel
      .findById(id)
      .select('-password -__v')
      .populate({
        path: 'sellerProfile',
        select: '-__v',
      })
      .populate({
        path: 'collaboratorProfile',
        select: '-__v',
      });
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

  async updateSellerProfile(
    id: string,
    updateSellerProfileDto: UpdateSellerProfileDto,
  ) {
    const sellerProfile = await this.sellerProfileModel.findByIdAndUpdate(
      id,
      updateSellerProfileDto,
      { new: true },
    );
    if (!sellerProfile) {
      throw new NotFoundException('Seller profile not found');
    }
    return sellerProfile;
  }
  async updateCollaboratorProfile(
    id: string,
    updateCollaboratorProfileDto: UpdateCollaboratorProfileDto,
  ) {
    const collaboratorProfile =
      await this.collaboratorProfileModel.findByIdAndUpdate(
        id,
        updateCollaboratorProfileDto,
        { new: true },
      );
    if (!collaboratorProfile) {
      throw new NotFoundException('Seller profile not found');
    }
    return collaboratorProfile;
  }
}
