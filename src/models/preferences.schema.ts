import { Schema, model } from 'mongoose';

interface IUserPreference {
    name: String
    description: String
    icon: String //image url or base64 file
};

const UserPreferenceSchema = new Schema<IUserPreference>({
    name: { type: String },
    description: { type: String },
    icon: { type: String }
});

const UserPreferences = model<IUserPreference>('UserPreferences', UserPreferenceSchema);

export { UserPreferences }