package com.panda;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.awpd.game.R;
import com.cocos.game.AppActivity;
import com.cocos.lib.CocosHelper;
import com.panda.module.ModuleManager;

import java.io.File;


public class GameActivity extends AppActivity {
    private static String TAG =  GameActivity.class.getSimpleName();
    private FrameLayout mRootLayout;
    private int splashViewId = 0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.i(TAG,"onCreate");
        // 检测本地版本是否发生变更 并清理缓存文件
        checkClearUpdDir();
        super.onCreate(savedInstanceState);

        mRootLayout = findViewById(contentViewId);
        this.showSplashView();
        // 自动关机延迟计时器
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                ModuleManager.shared().getActivity().hideSplashView();
            }
        },10000);
        // DO OTHER INITIALIZATION BELOW
        ModuleManager.shared().init(this);
    }

    @Override
    protected void onResume() {
        Log.i(TAG,"onResume");
        super.onResume();
        ModuleManager.shared().onResume();
    }

    @Override
    protected void onPause() {
        Log.i(TAG,"onPause");
        super.onPause();
        ModuleManager.shared().onPause();
    }

    @Override
    protected void onDestroy() {
        Log.i(TAG,"onDestroy");
        super.onDestroy();
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }
        ModuleManager.shared().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.i(TAG,"onActivityResult");
        super.onActivityResult(requestCode, resultCode, data);
        ModuleManager.shared().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        Log.i(TAG,"onNewIntent");
        super.onNewIntent(intent);
        ModuleManager.shared().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        Log.i(TAG,"onRestart");
        super.onRestart();
        ModuleManager.shared().onRestart();
    }

    @Override
    protected void onStop() {
        Log.i(TAG,"onStop");
        super.onStop();
        ModuleManager.shared().onStop();
    }

    @Override
    public void onBackPressed() {
        Log.i(TAG,"onBackPressed");
        ModuleManager.shared().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        Log.i(TAG,"onRequestPermissionsResult");
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        ModuleManager.shared().onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        Log.i(TAG,"onConfigurationChanged");
        ModuleManager.shared().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        Log.i(TAG,"onRestoreInstanceState");
        ModuleManager.shared().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        Log.i(TAG,"onSaveInstanceState");
        ModuleManager.shared().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        Log.i(TAG,"onStart");
        ModuleManager.shared().onStart();
        super.onStart();
    }

    @Override
    public void onLowMemory() {
        Log.i(TAG,"onLowMemory");
        ModuleManager.shared().onLowMemory();
        super.onLowMemory();
    }

    public void checkClearUpdDir() {
        String version = getVersionName(this);
        SharedPreferences settings = this.getSharedPreferences("app_info", 0);
        String cversion = settings.getString("app_version","");
        Log.i("CheckClearUpdDir",version);
        Log.i("CheckClearUpdDir old",cversion);
        if ( cversion.compareTo(version) != 0  ) {
            SharedPreferences.Editor editor = settings.edit();
            Log.i("aw_app_version",version);
            String updPath = CocosHelper.getWritablePath(this)+"/HotUpdate";
            File upd = new File(updPath);
            if (upd.exists()) {
                deleteDirWihtFile(upd);
                if (upd.exists()){
                    Log.i("aw_app_version","delete fail");
                }else{
                    Log.i("aw_app_version","delete");
                    editor.putString("app_version",version);
                }
            }else {
                Log.i("aw_app_version","exists fail");
                editor.putString("app_version",version);
            }
            editor.apply();
        }
    }

    public String getVersionName(Context context) {
        return getPackageInfo(context).versionName;
    }

    private PackageInfo getPackageInfo(Context context) {
        PackageInfo pi = null;
        try {
            PackageManager pm = context.getPackageManager();
            pi = pm.getPackageInfo(context.getPackageName(),
                    PackageManager.GET_CONFIGURATIONS);
            return pi;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return pi;
    }

    private void deleteDirWihtFile(File dir) {
        if (dir == null || !dir.exists() || !dir.isDirectory())
            return;
        for (File file : dir.listFiles()) {
            if (file.isFile())
                file.delete(); // 删除所有文件
            else if (file.isDirectory())
                deleteDirWihtFile(file); // 递规的方式删除文件夹
        }
        dir.delete();// 删除目录本身
    }

    public void showSplashView() {
        Log.i(TAG,"showSplashView");
        // 检查是否有界面残留
        this.hideSplashView();
        splashViewId = View.generateViewId();
        // 加载启动页布局文件
        View view = LayoutInflater.from(this).inflate(R.layout.acitvity_splash, mRootLayout,false);
        view.setId(splashViewId);
        mRootLayout.addView(view);
    }

    public void hideSplashView() {
        Log.i(TAG,"hideSplashView");
        if(splashViewId==0)return ;
        View view = findViewById(splashViewId);
        if( view != null) {
            ViewGroup parentView = (ViewGroup) view.getParent();
            if (parentView != null) {
                parentView.removeView(view);
            }
        }
        splashViewId = 0;
    }
}
