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
import * as bcrypt from 'bcrypt';
import { Booking } from 'src/bookings/schema/CreateBookings.schema';
import { UpdateSellerAvailabilityDto } from './dto/UpdateSellerAvailibility.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(SellerProfile.name)
    private sellerProfileModel: Model<SellerProfile>,
    @InjectModel(CollaboratorProfile.name)
    private collaboratorProfileModel: Model<CollaboratorProfile>,
  ) {}

  async createUser({
    sellerProfile,
    collaboratorProfile,
    ...createUserDto
  }: CreateUserDto) {
    let sellerProfileId;
    let collaboratorProfileId;

    if (sellerProfile) {
      // const newSellerProfile = new this.sellerProfileModel(sellerProfile);
      const newSellerProfile = new this.sellerProfileModel({
        ...sellerProfile,
        isProfileVerified: false,
      });
      const savedSellerProfile = await newSellerProfile.save();
      sellerProfileId = savedSellerProfile._id;
    }

    if (collaboratorProfile) {
      const newCollaboratorProfile = new this.collaboratorProfileModel({
        ...collaboratorProfile,
        isProfileVerified: false,
        servicesDone: [],
      });
      const savedCollaboratorProfile = await newCollaboratorProfile.save();
      collaboratorProfileId = savedCollaboratorProfile._id;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword, // Save hashed password
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

  async getUserById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).select('-password').exec();
  }

  async updateUserImagePath(id: string, file: any) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        userAvatar: {
          // url: file.url,
          key: file.key,
          mimetype: file.mimetype,
          size: file.size,
          originalName: file.originalName,
        },
      },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getCollaboratorProfile(userId: string): Promise<User | null> {
    return this.userModel
      .findById(userId)
      .select('-password -__v -sellerProfile')
      .populate({
        path: 'collaboratorProfile',
        select: '-__v',
      });
  }

  async getSellerProfile(userId: string): Promise<User | null> {
    const sellerProfile = await this.userModel
      .findById(userId)
      .select('-password -__v -collaboratorProfile')
      .populate({
        path: 'sellerProfile',
        select: '-__v',
      });

    if (!sellerProfile) {
      throw new Error('User not found');
    }
    const bookings = await this.bookingModel
      .find({ ownerId: userId })
      .select('serviceInfo bookingStatus createdAt');

    const servicesInfo = bookings.map((booking: any) => ({
      serviceId: booking?.serviceInfo,
      bookingId: booking?._id,
      bookingStatus: booking?.bookingStatus,
      createdAt: booking?.createdAt,
    }));
    sellerProfile.sellerProfile.servicesInfo = servicesInfo;
    return sellerProfile;
  }

  async updateSellerAvailability(
    sellerProfileId: string,
    updateSellerAvailabilityDto: UpdateSellerAvailabilityDto,
  ): Promise<SellerProfile> {
    const sellerProfile = await this.sellerProfileModel.findByIdAndUpdate(
      sellerProfileId,
      { availability: updateSellerAvailabilityDto.availability },
      { new: true },
    );

    if (!sellerProfile) {
      throw new NotFoundException('Seller profile not found');
    }

    return sellerProfile;
  }



}
