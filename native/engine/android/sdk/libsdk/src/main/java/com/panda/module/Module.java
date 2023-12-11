package com.panda.module;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import com.cocos.lib.GlobalObject;

import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.lang.reflect.Method;

public class Module {

    public interface MODULE_NAME {
        //请保证唯一性
        static String device = "device";
        static String bugly = "bugly";
        static String appsflyer = "appsflyer";
        static String adjust = "adjust";
        static String facebook = "facebook";
        static String leo = "leo";

        static String firebase = "firebase";
    }

    public interface SDKInterface {
        default void initApplication(Application context) {}
        default void init(Activity activity) {}
        default void onStart() {}
        default void onPause() {}
        default void onResume() {}
        default void onStop() {}
        default void onDestroy() {}
        default void onRestart() {}
        default void onNewIntent(Intent intent) {}
        default void onActivityResult(int requestCode, int resultCode, Intent data) {}
        default void onConfigurationChanged(Configuration newConfig) {}
        default void onRestoreInstanceState(Bundle savedInstanceState) {}
        default void onSaveInstanceState(Bundle outState) {}
        default void onBackPressed() {}
        default void onLowMemory() {}
        default void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {}
        default void postException(String reason, String stack) {}
    }

    public interface ModuleInterface {
        public void dispatchEventToScript(String eventName, String arg);
        public void evalString(String eventName);
    }

    public static abstract class ModuleBase implements SDKInterface {
        protected String _module_name;
        private ModuleInterface moduleInterface = null;
        private boolean jsModuleReady = false;

        public ModuleBase(String name) {
            this._module_name = name;
        }

        public void setModuleInterface(ModuleInterface moduleInterface) {
            this.moduleInterface = moduleInterface;
        }

        public void initByJs(JSONObject params) {
            JSONObject data = null;
            try {
                data = new JSONObject();
                data.put("version",getVersion());
                this.jsModuleReady = true;
                this.dispatchEventToScript("onInit",data);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        public String getModuleName() {
            return this._module_name;
        }

        public abstract int getVersion();
        @Override
        public void init(Activity activity) {
            Module.SDKInterface.super.init(activity);
        }

        public void onScriptEvent(String json) {
            Log.i(this._module_name,this.getClass().getSimpleName());
            Log.i(this._module_name,json);
            try {
                JSONObject jsonObject = new JSONObject(json);
                String method = jsonObject.getString("method");
                JSONObject params = jsonObject.optJSONObject("params");
                exeMethod(method,params);
            } catch (Exception ignored) {
                ignored.printStackTrace();
            }
        }

        /**
         * 执行反射方法
         * @param methodName
         * @param params
         */
        private void exeMethod(String methodName,JSONObject params) {
            Class moduleBaseClass = this.getClass();
            try {
                Method method = findMethod(moduleBaseClass,methodName);
                method.invoke(this,params);
            } catch (Exception e) {
                Log.e(this._module_name,methodName + " is exe error");
                e.printStackTrace();
            }
        }

        /**
         * 查找类方法
         * @param objClass
         * @param methodName
         * @return
         */
        private Method findMethod(Class objClass,String methodName) {
            Method method = null;
            try {
                method = objClass.getDeclaredMethod(methodName,JSONObject.class);
            } catch (Exception e) {
                Class objSuperClass = objClass.getSuperclass();
                if( objSuperClass != null) {
                    method = findMethod(objSuperClass,methodName);
                }
                if (method == null) {
                    e.printStackTrace();
                }
            }
            return method;
        }

        /**
         * java 通知 js事件
         * @param method
         * @param params
         * @param retryCount 尝试几次
         */
        public void dispatchEventToScript(final String method,final JSONObject params,final int retryCount) {
            /**
             * 超过一分钟就不在尝试了
             */
            if(retryCount >= 60) {
                Log.i(this._module_name,"is out trytime");
                return;
            }
            /**
             * js 模块未初始化好 延迟等待
             */
            if(this.jsModuleReady) {
                try {
                    JSONObject data = new JSONObject();
                    data.put("method",method);
                    data.put("params",params);
                    moduleInterface.dispatchEventToScript(_module_name, data.toString());
                } catch (Exception ignored) {
                    ignored.printStackTrace();
                }
            }else{
                Log.i(this._module_name,"is not ready");
                final ModuleBase obj = this;
                new Handler(getActivity().getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        //要执行的任务
                        try {
                            obj.dispatchEventToScript(method,params,retryCount+1);
                        } catch (Exception ignored) {
                            ignored.printStackTrace();
                        }
                    }
                }, 1000);
            }
        }

        /**
         * java 通知 js事件
         * @param method
         * @param params
         */
        public void dispatchEventToScript(final String method,final JSONObject params) {
            this.dispatchEventToScript(method,params,1);
        }

        public void evalString(String value) {
            moduleInterface.evalString(value);
        }

        protected void runOnUiThread(Runnable runnable) {
            getActivity().runOnUiThread(runnable);
        }

        protected Activity getActivity() {
            return GlobalObject.getActivity();
        }
    }
}
