package com.awpanda.pandaddz.wxapi;



import com.panda.module.Device;
import com.panda.module.ModuleManager;
import com.panda.module.Wechat;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;


public class WXEntryActivity extends Activity implements IWXAPIEventHandler{
	private String TAG = WXEntryActivity.class.getSimpleName();
	// IWXAPI 是第三方app和微信通信的openapi接口
    public IWXAPI api;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		api= Wechat.shared().api;
        this.getWxIntent();
    }
	
	@Override
	protected void onNewIntent(Intent intent) {
		// TODO Auto-generated method stub
		super.onNewIntent(intent);
		setIntent(intent);
		this.getWxIntent();
//		finish();
	}
	
	//获取接收消息的功能
	public void getWxIntent(){  
		Log.i("getWxIntent", "在WXEntryActivity中将接收到的intent及实现了IWXAPIEventHandler接口" +
				"的对象传递给IWXAPI接口的handleIntent方法");
		api.handleIntent(getIntent(), this);          		  
    }
	
	//微信发送请求到第三方应用的回调
	public void onReq(BaseReq req) {
		Log.i(TAG,"onReq");
		Wechat.shared().onReq(req);
	}
	
	//第三方应用请求微信的响应结果
	public void onResp(BaseResp resp) {
		Log.i(TAG,"onResp");

		Wechat.shared().onResp(resp);
		finish();
	}
	@Override
	protected void onResume(){
		super.onResume();
        Log.i(TAG,"onResume");
       new Thread() {
           @Override
           public void run() {
               super.run();
               try {
					Thread.sleep(200);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}//休眠3秒
               /**
                * 要执行的操作
                */
               finish();
           }
       }.start();
	}
}