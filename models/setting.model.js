import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    type: {
        type: String,
        enum: ['about us', 'privacy policy','terms'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Setting = mongoose.model('Setting', settingSchema);



export const createSetting = async (setting) => {
    const existingSetting = await Setting.findOne({ type: setting.type });
    if (existingSetting) {
        return Setting.updateOne({ type: setting.type }, setting);
    } else {
        return Setting.create(setting);
    }
};

export const getSetting = async (type) => {
    const setting = await Setting.findOne({ type });
    return setting;
};
