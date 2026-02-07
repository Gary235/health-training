import { db } from '../database';
import type { UserProfile } from '../../../types';

export class UserRepository {
  async getProfile(userId: string): Promise<UserProfile | undefined> {
    return await db.userProfiles.get(userId);
  }

  async getCurrentProfile(): Promise<UserProfile | undefined> {
    // For now, get the first profile (single user app)
    console.log('[UserRepository] Loading current profile...');
    const count = await db.userProfiles.count();
    console.log('[UserRepository] Total profiles in DB:', count);

    const profile = await db.userProfiles.toCollection().first();
    console.log('[UserRepository] Current profile:', profile ? profile.id : 'none');

    return profile;
  }

  async createProfile(profile: UserProfile): Promise<string> {
    console.log('[UserRepository] Creating profile:', profile.id);
    const id = await db.userProfiles.add(profile);
    console.log('[UserRepository] Profile created successfully:', id);

    // Verify it was saved
    const saved = await db.userProfiles.get(profile.id);
    console.log('[UserRepository] Verification - profile exists:', !!saved);

    return id;
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    await db.userProfiles.update(userId, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteProfile(userId: string): Promise<void> {
    await db.userProfiles.delete(userId);
  }

  async hasProfile(): Promise<boolean> {
    const count = await db.userProfiles.count();
    return count > 0;
  }
}

export const userRepository = new UserRepository();
