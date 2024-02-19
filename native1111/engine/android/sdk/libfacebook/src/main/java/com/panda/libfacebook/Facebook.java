package com.panda.libfacebook;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.LoggingBehavior;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.share.Sharer;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.model.SharePhoto;
import com.facebook.share.model.SharePhotoContent;
import com.facebook.share.widget.ShareDialog;
import com.panda.facebook.R;
import com.panda.module.Module;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Currency;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class Facebook extends Module.ModuleBase {
    private static String TAG = Facebook.class.getSimpleName();
    public AppEventsLogger logger;
    private CallbackManager callbackManager; //define CallbackManager
    public ShareDialog shareDialog;
    public  int share_pic_id 						= -1;
    @Override
    public int getVersion() {
        return 1;
    }

    public Facebook() {
        super(Module.MODULE_NAME.facebook);
    }

    @Override
    public void initApplication(Application context) {
        super.initApplication(context);try{
            ApplicationInfo appInfo = context.getPackageManager()
                    .getApplicationInfo(context.getPackageName(),
                            PackageManager.GET_META_DATA);
            String applicationId = appInfo.metaData.getString("com.facebook.sdk.ApplicationId");
            System.out.println("ModuleFacebook:applicationId:" + applicationId);
            FacebookSdk.setApplicationId(applicationId);
            FacebookSdk.sdkInitialize(context.getApplicationContext());
            FacebookSdk.setIsDebugEnabled(true);
            FacebookSdk.addLoggingBehavior(LoggingBehavior.APP_EVENTS);


            AppEventsLogger.activateApp(context);
            FacebookSdk.setAutoInitEnabled(true);
            FacebookSdk.fullyInitialize();
            FacebookSdk.setAutoLogAppEventsEnabled(true);
            FacebookSdk.setAdvertiserIDCollectionEnabled(true);
            logger = AppEventsLogger.newLogger(context);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void init(Activity activity) {
        super.init(activity);
        callbackManager = CallbackManager.Factory.create();
        LoginManager.getInstance().registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                Log.e(TAG, "登录成功: " + loginResult.getAccessToken().getToken());
                // App code
                AccessToken accessToken = loginResult.getAccessToken();
                final String userId = accessToken.getUserId();
                final String token = accessToken.getToken();

                GraphRequest request = GraphRequest.newMeRequest(
                        loginResult.getAccessToken(),
                        new GraphRequest.GraphJSONObjectCallback() {

                            //當RESPONSE回來的時候

                            @Override
                            public void onCompleted(JSONObject object, GraphResponse response) {
                                //讀出姓名 ID FB個人頁面連結
                                try {
                                    if ( response.getError() == null ) {
                                        Log.d("FB","complete");
                                        Log.d("FB",object.optString("name"));
                                        Log.d("FB",object.optString("id"));
                                        final String name = object.optString("name");
                                        final String id = object.optString("id");
                                        JSONObject obj = new JSONObject();
                                        obj.put("name",name);
                                        obj.put("id",id);
                                        obj.put("token",token);
                                        dispatchEventToScript("onLoginSuccess",obj);
                                    }else {
                                        JSONObject obj = new JSONObject();
                                        obj.put("errorMsg",response.getError().toString());
                                        dispatchEventToScript("onLoginFail",obj);
                                    }
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            }
                        });

                //包入你想要得到的資料 送出request

                Bundle parameters = new Bundle();
                parameters.putString("fields", "id,name,gender");
                request.setParameters(parameters);
                request.executeAsync();
            }

            @Override
            public void onCancel() {
                Log.e(TAG, "登录取消");
                JSONObject obj = new JSONObject();
                dispatchEventToScript("onLoginCancel",obj);
            }

            @Override
            public void onError(FacebookException exception) {
                Log.e(TAG, "登录错误");
                try {
                    JSONObject obj = new JSONObject();
                    obj.put("errorMsg",exception.getMessage());
                    dispatchEventToScript("onLoginFail",obj);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

        shareDialog = new ShareDialog(getActivity());
        shareDialog.registerCallback(callbackManager, new FacebookCallback<Sharer.Result>() {
            @Override
            public void onSuccess(Sharer.Result result) {
                Log.i(TAG,"Success");
                JSONObject obj = new JSONObject();
                dispatchEventToScript("onShareSuccess",obj);
            }

            @Override
            public void onCancel() {
                Log.i(TAG,"Cancel");
                JSONObject obj = new JSONObject();
                dispatchEventToScript("onShareCancel",obj);
            }

            @Override
            public void onError(final FacebookException error) {
                Log.i(TAG,"Error");
                Log.i(TAG,error.toString());
                try {
                    JSONObject obj = new JSONObject();
                    obj.put("errorMsg",error.toString());
                    dispatchEventToScript("onShareFail",obj);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        callbackManager.onActivityResult(requestCode, resultCode, data);
        super.onActivityResult(requestCode, resultCode, data);
    }

    public void loginFacebook(JSONObject params) {
        if (isLoggedIn()) logoutFacebook(null);
        System.out.println("ModuleFacebook:login() call login 11111:");
        LoginManager.getInstance().logInWithReadPermissions(getActivity(), Arrays.asList("email"));
    }

    public void logoutFacebook(JSONObject params){
        LoginManager.getInstance().logOut();
    }

    public boolean isLoggedIn(){
        AccessToken accessToken = AccessToken.getCurrentAccessToken();
        boolean isLoggedIn = accessToken != null && !accessToken.isExpired();
        return isLoggedIn;
    }

    public void shareLink(JSONObject params){
        String url = params.optString("url");
        String msg = params.optString("msg");
        ShareLinkContent.Builder builder = new ShareLinkContent.Builder()
                .setContentUrl(Uri.parse(url));

        if (!msg.equals("")) {
            builder.setQuote(msg);
        }
        ShareLinkContent content = builder.build();
        shareDialog.show(content);
    }

    public void shareMore(JSONObject params){
        String url = params.optString("url");
        String title = params.optString("title");
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(Intent.EXTRA_TEXT, url);
        getActivity().startActivity(Intent.createChooser(intent,title));
    }

    public void _shareImage(final String picpath) {
        // 分享图片
        Bitmap image = getImage(picpath); // BitmapFactory.decodeFile(imagePath);

        if (image == null){
            Toast.makeText(getActivity(), "Image loading failed",
                    Toast.LENGTH_LONG).show();
        }

        SharePhoto sharePhoto = new SharePhoto.Builder().setBitmap(image).build();

        ArrayList<SharePhoto> photos = new ArrayList<>();
        photos.add(sharePhoto);

        SharePhotoContent content =
                new SharePhotoContent.Builder().setPhotos(photos).build();

        shareDialog.show(content);
    }

    public void shareImage(JSONObject params){
        String picpath = params.optString("img",null);
        if (ShareDialog.canShow(SharePhotoContent.class)) {
            _shareImage(picpath);
            return;
        }
    }

    /**
     * 获取图片
     * @param picpath
     * @return
     */
    public  Bitmap getImage(String picpath){
        //程序的icon
        if(picpath==null) {
            System.out.println("getImage Icon img");
            return getApplicationBitmap();
        }

        //本地图片
        if(picpath.indexOf("screen")!=-1){
            System.out.println("getImage screen img");
            File file = new File(picpath);
            if (file.exists()) {
                Bitmap bitmap = BitmapFactory.decodeFile(picpath);
                if( bitmap == null )
                    return null;
                return compe(bitmap);
            } else {
                return getApplicationBitmap();
            }
        }

        //网络图片
        if (picpath.indexOf("http")!=-1){
            System.out.println("getImage http img");
            try {
                return BitmapFactory.decodeStream(new URL(picpath).openStream());
            } catch (IOException e) {
                e.printStackTrace();
                System.out.println("getImage http img fail");
            }
            return null;
        }
        //截图
        AssetManager am = getActivity().getResources().getAssets();
        InputStream is = null;
        try {
            is = am.open(picpath);
            return BitmapFactory.decodeStream(is);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /** 1.图片尺寸压缩
     * @param image
     * @return
     */
    public  Bitmap compe(Bitmap image) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 100, baos);
        if( baos.toByteArray().length / 1024 > 1024) {//判断如果图片大于1M,进行压缩避免在生成图片（BitmapFactory.decodeStream）时溢出
            baos.reset();//重置baos即清空baos
            image.compress(Bitmap.CompressFormat.JPEG, 50, baos);//这里压缩50%，把压缩后的数据存放到baos中
        }
        ByteArrayInputStream isBm = new ByteArrayInputStream(baos.toByteArray());
        BitmapFactory.Options newOpts = new BitmapFactory.Options();
        //开始读入图片，此时把options.inJustDecodeBounds 设回true了
        newOpts.inJustDecodeBounds = true;
        Bitmap bitmap = BitmapFactory.decodeStream(isBm, null, newOpts);
        newOpts.inJustDecodeBounds = false;
        int  w = newOpts.outWidth;
        int  h = newOpts.outHeight;
        int width,height,scale=1;
        if(w>h){
            width=1280;
            height=720;
        }else{
            width=720;
            height=1280;
        }
        if(w>width){
            if(w%width==0)
                scale=w/width;
            else
                scale=w/width+1;
        }else
            scale=1;
        newOpts.inSampleSize = scale;//设置缩放比例
        //重新读入图片，注意此时已经把options.inJustDecodeBounds 设回false了
        isBm = new ByteArrayInputStream(baos.toByteArray());
        bitmap = BitmapFactory.decodeStream(isBm, null, newOpts);
        return compressImage(bitmap);//压缩好比例大小后再进行质量压缩
    }

    /**
     * 2.图片质量压缩
     * @param image
     * @return
     */
    public  Bitmap compressImage(Bitmap image) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 100, baos);//质量压缩方法，这里100表示不压缩，把压缩后的数据存放到baos中
        int options = 100;
        while ( baos.toByteArray().length / 1024>100) {  //循环判断如果压缩后图片是否大于100kb,大于继续压缩
            baos.reset();//重置baos即清空baos
            image.compress(Bitmap.CompressFormat.JPEG, options, baos);//这里压缩options%，把压缩后的数据存放到baos中
            options -= 5;//每次都减少10
        }
        ByteArrayInputStream isBm = new ByteArrayInputStream(baos.toByteArray());//把压缩后的数据baos存放到ByteArrayInputStream中
        Bitmap bitmap = BitmapFactory.decodeStream(isBm, null, null);//把ByteArrayInputStream数据生成图片
        return bitmap;
    }

    /**
     * 压缩
     * @param bmp
     * @param needRecycle
     * @return
     */
    public  byte[] bmpToByteArray(final Bitmap bmp, final boolean needRecycle) {
        Log.i("bmpToByteArray", "正在运行中");

        int i=bmp.getWidth();
        int j=bmp.getHeight();

        Bitmap localBitmap = Bitmap.createBitmap(i, j, Bitmap.Config.RGB_565);
        Canvas localCanvas =  new Canvas(localBitmap);
        localCanvas.drawColor(Color.WHITE);
        while (true) {
            Paint paint = new Paint();
            paint.setColor(Color.WHITE);
            if( !bmp.isRecycled() ) {
                localCanvas.drawBitmap(bmp,  new Rect(0, 0, i, j),  new Rect(0, 0,i, j),  paint);
                if (needRecycle){
                    bmp.recycle();
                    System.gc();
                }
            }
            ByteArrayOutputStream localByteArrayOutputStream =  new ByteArrayOutputStream();
            localBitmap.compress(Bitmap.CompressFormat.JPEG, 100, localByteArrayOutputStream);
            localBitmap.recycle();
            System.gc();
            byte[] arrayOfByte = localByteArrayOutputStream.toByteArray();
            try {
                localByteArrayOutputStream.close();
            }  catch (Exception e) {
                e.printStackTrace();
            }
            return arrayOfByte;
        }
    }
    /**
     * 获取自己应用程序的图标
     */
    public  Bitmap getApplicationBitmap()
    {
        if (share_pic_id != -1) {
            return getApplicationBitmapformID();
        }

        PackageManager packageManager = null;
        ApplicationInfo applicationInfo = null;
        try {
            packageManager = getActivity().getPackageManager();
            applicationInfo = packageManager.getApplicationInfo(
                    getActivity().getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            applicationInfo = null;
        }

        BitmapDrawable dd = (BitmapDrawable) applicationInfo
                .loadIcon(packageManager);
        Bitmap bmp = dd.getBitmap();

        return bmp;
    }

    /**
     * 获取自己应用程序的图标
     */
    public  Bitmap getApplicationBitmapformID()
    {
        return BitmapFactory.decodeResource(getActivity().getResources(),share_pic_id);
    }

    public void logPurchase(JSONObject params) {
        try {
            final String purchaseAmountStr = params.optString("purchaseAmount");
            final String currencyStr = params.optString("currency");
            Log.i("logPurchase",purchaseAmountStr + currencyStr);
            BigDecimal purchaseAmount = BigDecimal.valueOf(Double.parseDouble(purchaseAmountStr));
            Currency currency = Currency.getInstance(currencyStr);
            Bundle parameters = new Bundle();
            logger.logPurchase(purchaseAmount, currency, parameters);
        }  catch (Exception e) {
            e.printStackTrace();
        }
    }
}
