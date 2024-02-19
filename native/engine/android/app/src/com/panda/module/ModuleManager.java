package com.panda.module;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.os.Bundle;

import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;
import com.cocos.lib.JsbBridgeWrapper;
import com.panda.GameActivity;
import com.panda.util.PDLog;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

public class ModuleManager {
    private static String Tag = ModuleManager.class.getSimpleName();

    private static class ModuleManagerInstance {
        private static final ModuleManager mInstance = new ModuleManager();
    }
    public static ModuleManager shared() { return ModuleManager.ModuleManagerInstance.mInstance; }

    private WeakReference<GameActivity> mActivity = null;
    private List<Module.ModuleBase> serviceInstances;

    private void loadSDKInterface() {
        this.serviceInstances = new ArrayList<>();
        try {
            for (Class serviceClasse:ModuleConfig.serviceBaseClasses) {
                PDLog.i(Tag,serviceClasse.getSimpleName());
                this.addSDKInterface((Module.ModuleBase) serviceClasse.newInstance());
            }
            for (Class serviceClasse:ModuleConfig.serviceClasses) {
                PDLog.i(Tag,serviceClasse.getSimpleName());
                this.addSDKInterface((Module.ModuleBase) serviceClasse.newInstance());
            }
        } catch (Exception ignored) { ignored.printStackTrace(); }
    }

    static Module.ModuleInterface moduleInterface = new Module.ModuleInterface() {
        @Override
        public void dispatchEventToScript(String eventName, String arg) {
            PDLog.i(Tag, eventName);
            PDLog.i(Tag, arg);
            JsbBridgeWrapper.getInstance().dispatchEventToScript(eventName, arg);
        }

        @Override
        public void evalString(final String value) {
            CocosHelper.runOnGameThread(new Runnable() {
                @Override
                public void run() {
                    CocosJavascriptJavaBridge.evalString(value);
                }
            });
        }
    };

    public void addSDKInterface(Module.ModuleBase moduleBase) {
        String moduleName = moduleBase.getModuleName();
        JsbBridgeWrapper.OnScriptEventListener onScriptEventListener = new JsbBridgeWrapper.OnScriptEventListener() {
            @Override
            public void onScriptEvent(String arg) {
                moduleBase.onScriptEvent(arg);
            }
        };

        moduleBase.setModuleInterface(moduleInterface);
        JsbBridgeWrapper.getInstance().addScriptEventListener(moduleName, onScriptEventListener);
        this.serviceInstances.add(moduleBase);
    }
    public GameActivity getActivity() { return this.mActivity.get(); }

    public void initApplication(Application context) {
        this.loadSDKInterface();
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.initApplication(context);
        }
    }

    public void init(GameActivity activity) {
        this.mActivity = new WeakReference<>(activity);
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.init(activity);
        }
    }

    public void onResume() {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onResume();
        }
    }

    public void onPause() {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onPause();
        }
    }

    public void onDestroy() {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onDestroy();
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onActivityResult(requestCode, resultCode, data);
        }
    }

    public void onNewIntent(Intent intent) {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onNewIntent(intent);
        }
    }

    public void onRestart() {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onRestart();
        }
    }

    public void onStop() {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onStop();
        }
    }

    public void onBackPressed() {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onBackPressed();
        }
    }

    public void onConfigurationChanged(Configuration newConfig) {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onConfigurationChanged(newConfig);
        }
    }

    public void onRestoreInstanceState(Bundle savedInstanceState) {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onRestoreInstanceState(savedInstanceState);
        }
    }

    public void onSaveInstanceState(Bundle outState) {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onSaveInstanceState(outState);
        }
    }

    public void onStart() {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onStart();
        }
    }

    public void onLowMemory() {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onLowMemory();
        }
    }

    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    public void postException(String reason, String stack) {
        for (Module.SDKInterface sdk : this.serviceInstances) {
            sdk.postException(reason, stack);
        }
    }
}
