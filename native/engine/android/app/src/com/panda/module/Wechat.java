package com.panda.module;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import com.panda.GameActivity;
import com.panda.util.AdvertisingIdClient;
import com.panda.util.EasyPhotos;

import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.List;
import java.util.concurrent.Executors;

import pub.devrel.easypermissions.EasyPermissions;

import static com.panda.util.Utils.setRequestedOrientation;

public class Wechat extends Module.ModuleBase implements EasyPermissions.PermissionCallbacks{
    private static final String TAG = Wechat.class.getSimpleName();
    private static Wechat mInstance;
    public static boolean mOptOutEnabled;
    //微信通信openapi接口
    public static IWXAPI api;
    public static String app_id 							="wx73934569f0563550";
    public static String app_secret 					= "fb692a697563956ef1c5850386a44e2b";
    public static String share_title 						=	"";
    public static String share_desc 					= "";
    public static String share_url						= "";
    public static String share_picpath 				= "";
    public static int share_state 						=	1;
    public static int share_type 							=	1;
    public static int LuaFunc 								= -100;
    public static boolean isAuthorize 				= false;
    public static boolean isShare						= false;
    public static GameActivity mActivity;
    private static final int SDK_LOGIN 				= 101;
    private static final int SDK_SHARE 				= 102;

    private static final int HAVING					=	0;
    private static final int SUCCESS					=	1;
    private static final int REFUSE						=	2;
    private static final int CANCEL						=	3;
    private static final int FAIL							=	4;

    public static Wechat shared() { return Wechat.mInstance; }

    Wechat() {
        super(Module.MODULE_NAME.wechat);
        mInstance = this;
        System.out.println("wechatAuthorize-1"+isAuthorize);

    }

    protected void onCreate(Bundle savedInstanceState) {
        Log.i(TAG,"WechatonCreate"+ Wechat.shared().app_id +  Wechat.shared().api);
    }

    /**
     * 授权登录
     */
    public static void wechatAuthorize(final String appId,final String appSecert){

        System.out.println("wechatAuthorize0"+isAuthorize);
        isAuthorize = true;
        System.out.println("wechatAuthorize1"+isAuthorize);
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                // 通过WXAPIFactory工厂，获取IWXAPI的实例

                Message msg = new Message();
                msg.what = SDK_LOGIN;
                System.out.println("wechatAuthorize2"+isAuthorize);
                shareHandler.sendMessage(msg);


            }
        };
        mActivity.runOnUiThread(runnable);
    }

    public static void wechatCallback(final String event){
        Log.i("","错误号3"  );
        try {
            Log.i("","错误号4"  );
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("event", event);
            Device.shared().dispatchEventToScript("wechatCallback", jsonObject);
        } catch (Exception e) {
            Log.i("","错误号5"  );
            e.printStackTrace();
        }
    }

    static private Handler shareHandler = new Handler() {
        public void handleMessage(Message msg) {
            Log.i("msg.what",""+msg.what);
            switch (msg.what) {
                //授权登录
                case SDK_LOGIN: {
                    System.out.println("wechatAuthorize3"+isAuthorize);
                    if(api.isWXAppInstalled()){
                        System.out.println("wechatAuthorize4"+isAuthorize);
                        Login();
                    }
                    else{
                        System.out.println("wechatAuthorize-1"+isAuthorize);
                        wechatCallback(FAIL+"#授权失败#"+"没有安装微信");
                        System.out.println("isAuthorize6"+isAuthorize);
                        isAuthorize = false;
                    }
                    break;
                }
                //分享
                case SDK_SHARE: {
                    if(api.isWXAppInstalled())
                    {
//                        switch (share_type) {
//                            case TEXT:
//                                shareText(share_title,share_state);
//                                break;
//                            case IMAGE:
//                                shareImage(share_picpath,share_state);
//                                break;
//                            case MUSIC:
//                                shareMusic(share_title,share_desc,share_url,share_picpath,share_state);
//                                break;
//                            case VIDEO:
//                                shareVideo(share_title,share_desc,share_url,share_picpath,share_state);
//                                break;
//                            case WEBPAGE:
//                                shareWebpage(share_title,share_desc,share_url,share_picpath,share_state);
//                                break;
//                            default:
//                                shareWebpage(share_title,share_desc,share_url,share_picpath,share_state);
//                                break;
//                        }
                    }
                    else
                    {
                        wechatCallback(FAIL+"#分享失败#"+"没有安装微信");
                        isShare = false;
                    }
                    break;
                }
                default:
                    break;
            }
        }
    };

    /**
     * 授权登录
     */
    public static void Login(){
        Log.i("授权登录", "正在调用");
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "wechat_sdk";
        //微信向第三方app请求数据，第三方app回应数据之后会切回到微信界面
        System.out.println("wechatAuthorize5"+isAuthorize);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        api.sendReq(req);
    }

    /**
     *  第三方应用发送到微信的请求处理后的响应结果，会回调到该方法
     * @param req
     */
    public static void onReq(BaseReq req) {
        Log.i("req=----",""+req);
//        try {
//            Intent intent = new Intent(mActivity,Wechat.class);
//            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//            mActivity.startActivity(intent);
//        }
//        catch (Exception e) {
//            Log.i(null,e.getMessage());
//        }
    }

    /**
     *  第三方应用发送到微信的请求处理后的响应结果，会回调到该方法
     * @param resp
     */
    public static void onResp(final BaseResp resp) {
        Log.i("","错误号:" + resp.errCode + ";\n信息:" + resp.errStr + "\n类型:" + resp.getType());
        switch (resp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
//                instance.runOnGLThread(new Runnable() {
//                    @Override
//                    public void run() {
                        //当前状态为授权状态
                Log.i("","错误号1" + isAuthorize+isShare );
                        if(isAuthorize && resp.getType() == 1){
                            //获取access_token
                            String code = ((SendAuth.Resp) resp).code;
                            Log.i("","错误号2" + code );
                            wechatCallback(HAVING+"#请求参数#"+code);
                            System.out.println("isAuthorize"+isAuthorize);

//                finish();
                            isAuthorize=false;
                        }
                        else if(isShare==true && resp.getType() == 2){
                            wechatCallback(SUCCESS+"#分享成功#"+resp.errCode);
                            isShare=false;
                        }else {
                            mActivity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(mActivity,"稍后再试",Toast.LENGTH_SHORT);
                                }
                            });
                        }
                //                    }
//                });
                break;

            case BaseResp.ErrCode.ERR_USER_CANCEL:
                //                instance.runOnGLThread(new Runnable() {
//                    @Override
//                    public void run() {
                        if(isAuthorize && resp.getType() == 1){
                            wechatCallback(CANCEL+"#取消授权#"+"取消授权");
                            System.out.println("isAuthorize2"+isAuthorize);
                            isAuthorize=false;
                        }else if(isShare && resp.getType() == 2){
                            wechatCallback(CANCEL+"#取消分享#"+"取消分享");
                            isShare=false;
                        }else {
                            mActivity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(mActivity,"稍后再试",Toast.LENGTH_SHORT);
                                }
                            });
                        }
                //                    }
//                });
                break;

            case BaseResp.ErrCode.ERR_AUTH_DENIED:
//                instance.runOnGLThread(new Runnable() {
//                    @Override
//                    public void run() {
                        if(isAuthorize && resp.getType() == 1){
                            wechatCallback(REFUSE+"#授权被拒绝#"+"授权被拒绝");
                            System.out.println("isAuthorize3"+isAuthorize);
                            isAuthorize=false;
                        }else if(isShare && resp.getType() == 2){
                            wechatCallback(REFUSE+"#分享被拒绝#"+"分享被拒绝");
                            isShare=false;
                        }else {
                            mActivity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(mActivity,"稍后再试",Toast.LENGTH_SHORT);
                                }
                            });
                        }
//                    }
//                });
                break;

            default:
//                instance.runOnGLThread(new Runnable() {
//                    @Override
//                    public void run() {
                        if(isAuthorize && resp.getType() == 1){
                            wechatCallback( FAIL+"#授权返回#"+resp.errCode);
                            System.out.println("isAuthorize4"+isAuthorize);
                            isAuthorize=false;
                        }else if(isShare && resp.getType() == 2){
                            wechatCallback(FAIL+"#分享返回#"+resp.errCode);
                            isShare=false;
                        }else {
                            mActivity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(mActivity,"稍后再试",Toast.LENGTH_SHORT);
                                }
                            });
                        }
//                    }
//                });
                break;
        }
    }

    @Override
    public int getVersion() {
        return 1;
    }

    @Override
    public void init(Activity activity) {
        super.init(activity);
        mActivity = (GameActivity) activity;
        api = WXAPIFactory.createWXAPI(mActivity, app_id, true);
        // 将应用注册到微信
        api.registerApp(app_id);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        // Forward results to EasyPermissions
        EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }

    @Override
    public void onPermissionsGranted(int requestCode, List<String> perms) {
        try {
            JSONObject data = new JSONObject();
            JSONArray jperms= new JSONArray(perms);
            data.put("perms",jperms);
            data.put("requestCode",requestCode);
            dispatchEventToScript("onPermissionsGranted",data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPermissionsDenied(int requestCode, List<String> perms) {
        try {
            JSONObject data = new JSONObject();
            JSONArray jperms= new JSONArray(perms);
            data.put("perms",jperms);
            data.put("requestCode",requestCode);
            dispatchEventToScript("onPermissionsDenied",data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
