package com.panda.util;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;


import androidx.core.content.FileProvider;

import com.panda.module.Device;
import com.panda.module.ModuleManager;
import com.panda.util.cropImage.CropImage;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.ref.WeakReference;
import java.util.List;

import pub.devrel.easypermissions.EasyPermissions;

public class EasyPhotos {
    private static String TAG = EasyPhotos.class.getSimpleName();
    private static final int REQUEST_CODE_pickFromGallery = 11; // 新版从sd卡得到图像的请求码
    private static final int REQUEST_CODE_pickFromCapture = 12; // 新版从相机得到图像的请求码
    private static final int REQUEST_CODE_CROP_IMAGE = 13; // 新版从sd卡裁剪返回的邀请码

    private static File mFileTemp;
    private static Activity mActivity = null;

    private static boolean isAutoCompressImage = true;
    // 默认压缩图片的的大小
    private static int compressImageWidth = 480;
    private static int compressImageHeight = 800;

    public static void init(Activity activity) {
        mActivity = activity;
    }

    public static void pickFromGallery(final String path) {
        if(!EasyPermissions.hasPermissions(ModuleManager.shared().getActivity(), "android.permission.READ_EXTERNAL_STORAGE")){
            return ;
        }
        PDLog.d(TAG, "pickFromGallery");
        PDLog.i(TAG,path);
        mFileTemp = new File(path);
        if(!mFileTemp.getParentFile().exists()) {
            if(!mFileTemp.getParentFile().mkdirs()) {
                Log.i(TAG,"creater parent directory failed. " + path);
                return ;
            }
        }

        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("image/*");
        Uri mImageCaptureUri = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            mImageCaptureUri = FileProvider.getUriForFile(mActivity,
                    mActivity.getApplicationContext().getPackageName() +".provider",
                    mFileTemp);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } else {
            mImageCaptureUri = Uri.fromFile(mFileTemp);
        }
        intent.putExtra(MediaStore.EXTRA_OUTPUT, mImageCaptureUri);
        mActivity.startActivityForResult(intent,
                REQUEST_CODE_pickFromGallery);
    }

    public static void pickFromCapture(final String path) {
        PDLog.i(TAG,"pickFromCapture");
        PDLog.i(TAG, path);
        if(!EasyPermissions.hasPermissions(ModuleManager.shared().getActivity(), "android.permission.CAMERA")){
            return ;
        }
        mFileTemp = new File(path);
        if(!mFileTemp.getParentFile().exists()) {
            if(!mFileTemp.getParentFile().mkdirs()) {
                Log.i(TAG,"creater parent directory failed. " + path);
                return ;
            }
        }
        Intent intentC = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        Uri mImageCaptureUri = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            mImageCaptureUri = FileProvider.getUriForFile(mActivity,
                            mActivity.getApplicationContext().getPackageName() +".provider",
                            mFileTemp);
            intentC.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } else {
            mImageCaptureUri = Uri.fromFile(mFileTemp);
        }
        intentC.putExtra(MediaStore.EXTRA_OUTPUT, mImageCaptureUri);
        mActivity.startActivityForResult(intentC, REQUEST_CODE_pickFromCapture);
    }

    public static void failResultCode(String method,int resultCode) {
        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("returnCode",0);
            jsonObject.put("activity_resultCode",resultCode);
            Device.shared().dispatchEventToScript(method,jsonObject);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case REQUEST_CODE_pickFromGallery:{
                if (resultCode != Activity.RESULT_OK) {
                    failResultCode("onPickFromGallery",resultCode);
                    return;
                }
                if (data != null) {
                    try {
                        InputStream inputStream = mActivity.getContentResolver()
                                .openInputStream(data.getData());
                        FileOutputStream fileOutputStream = new FileOutputStream(
                                mFileTemp);
                        copyStream(inputStream, fileOutputStream);
                        fileOutputStream.close();
                        inputStream.close();
                        if(isAutoCompressImage) {
                            if(!compressImage(mFileTemp.getAbsolutePath(),mFileTemp.getAbsolutePath())) {
                                failResultCode("onPickFromGallery",resultCode);
                                return;
                            }
                        }
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("returnCode",1);
                        jsonObject.put("path",mFileTemp.getAbsolutePath());
                        Device.shared().dispatchEventToScript("onPickFromGallery",jsonObject);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                break;
            }
            case REQUEST_CODE_pickFromCapture:{
                if (resultCode != Activity.RESULT_OK) {
                    failResultCode("onPickFromCapture",resultCode);
                    return;
                }
                try {
                    if(isAutoCompressImage) {
                        if(!compressImage(mFileTemp.getAbsolutePath(),mFileTemp.getAbsolutePath())) {
                            failResultCode("onPickFromCapture", resultCode);
                            return;
                        }
                    }
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("returnCode",1);
                    jsonObject.put("path",mFileTemp.getAbsolutePath());
                    Device.shared().dispatchEventToScript("onPickFromCapture",jsonObject);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            }
            case REQUEST_CODE_CROP_IMAGE: {
                if (resultCode != Activity.RESULT_OK) {
                    failResultCode("onCropImage",resultCode);
                    return;
                }
                try {
                    String path = mFileTemp.getAbsolutePath();
                    Log.d("裁剪路径:", path);
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("returnCode",1);
                    jsonObject.put("path",path);
                    Device.shared().dispatchEventToScript("onCropImage",jsonObject);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            }
        }
    }

    public static void startCropImage(final String inPath,final String outPath,int width,int height) {
        mFileTemp = new File(outPath);

        Intent intent = new Intent(mActivity, CropImage.class);
        intent.putExtra(CropImage.IMAGE_PATH, inPath);
        intent.putExtra(CropImage.IMAGE_OUT_PATH, outPath);
        intent.putExtra(CropImage.SCALE, true);

        intent.putExtra(CropImage.ASPECT_X, 3);
        intent.putExtra(CropImage.ASPECT_Y, 3);
        intent.putExtra(CropImage.OUTPUT_X, width);
        intent.putExtra(CropImage.OUTPUT_Y, height);

        mActivity.startActivityForResult(intent, REQUEST_CODE_CROP_IMAGE);
    }

    public static void copyStream(InputStream input, OutputStream output)
            throws IOException {

        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = input.read(buffer)) != -1) {
            output.write(buffer, 0, bytesRead);
        }
    }

    public static String saveImage(File file, Bitmap bmp) {
        try {
            FileOutputStream fos = new FileOutputStream(file);
            bmp.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            fos.close();
            return file.getAbsolutePath();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String getImageInfo(String path) {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        try {
            BitmapFactory.decodeFile(path, options);
            final int height = options.outHeight;
            final int width = options.outWidth;
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("height",height);
            jsonObject.put("width",width);
            return jsonObject.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return e.toString();
        }
    }

    public static void setCompressImageInfo(boolean isAutoCompressImage,int compressImageWidth,int compressImageHeight) {
        EasyPhotos.isAutoCompressImage = isAutoCompressImage;
        EasyPhotos.compressImageWidth = compressImageWidth;
        EasyPhotos.compressImageHeight = compressImageHeight;
    }

    public static boolean compressImage(String path,String outPath) {
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(path, options);
            final int height = options.outHeight;
            final int width = options.outWidth;
            options.inSampleSize = 1;
            int w = compressImageWidth;
            int h = compressImageHeight;
            h = w*height/width;//计算出宽高等比率
            int a = options.outWidth/ w;
            int b = options.outHeight / h;
            options.inSampleSize = Math.max(a, b);
            options.inJustDecodeBounds = false;
            Bitmap bitmap = BitmapFactory.decodeFile(path, options);

            File f = new File(outPath);
            FileOutputStream outputStream = new FileOutputStream(f);
            bitmap.compress(Bitmap.CompressFormat.JPEG,100,outputStream);
            outputStream.flush();
            outputStream.close();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
