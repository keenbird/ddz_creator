//添加微信官方支付跟分享一样，包名要一致
package com.awpanda.pandaddz.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.common.internal.Constants;
import com.panda.module.Wechat;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler{
	
	private static final String TAG = "MicroMsg.SDKSample.WXPayEntryActivity";
	
    private IWXAPI api;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
//    	api = Wechat.api;
//
//        api.handleIntent(getIntent(), this);
    }

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
//		setIntent(intent);
//        api.handleIntent(intent, this);
	}

	@Override
	public void onReq(BaseReq req) {
	}

	@Override
	public void onResp(BaseResp resp) {
		Log.d("WXPay支付", "onPayFinish, errCode = " + resp.errCode);
		Log.d("WXPay支付", "onPayFinish, errStr = " + resp.errStr);
		
		if (resp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX) {
//			if (resp.errCode==0) {
//				WeixinRecharge.ToShowToast("支付成功");
//			} else {
//
//				WeixinRecharge.ToShowToast("支付失败");
//			}
		}
		//关闭自己
		finish();
	}
}