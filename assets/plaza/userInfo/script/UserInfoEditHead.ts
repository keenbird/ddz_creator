import { EventMouse, EventTouch, ImageAsset, Node as ccNode, Sprite, SpriteFrame, Texture2D, UITransform, Vec2, Vec3, _decorator } from 'cc';
const { ccclass } = _decorator;

import { httpConfig } from '../../../app/config/HttpConfig';
import { DOWN_IMAGE_TYPE } from '../../../app/config/ConstantConfig';
import { CustomFormData } from '../../../app/framework/manager/FWHttpManager';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('UserInfoEditHead')
export class UserInfoEditHead extends FWDialogViewBase {
	/**当前图片位置 */
	imgPos: Vec3
	/**缩放尺寸差值 */
	adaptDiffScale: number = 0
	/**最小缩放尺寸 */
	adaptMinScale: number = 0
	/**最小缩放尺寸 */
	adaptMaxScale: number = 0
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		this.Items.Label_title.obtainComponent(fw.FWLanguage).bindLabel({
			[fw.LanguageType.en]: `Upload Avatar`,
			[fw.LanguageType.brasil]: `Carregar Avatar`,
		}[fw.language.languageType]);
		this.Items.Label_sure.obtainComponent(fw.FWLanguage).bindLabel(`Confirm`);
		this.Items.Label_select.obtainComponent(fw.FWLanguage).bindLabel(`Select`);
		//精灵
		//--多语言处理--end--------------------------------------------
		//图片名称
		let serverPicID = center.user.getActorMD5Face();
		let picName = (`${serverPicID}`).match(/[\w\.]*$/)[0];
		//文件绝对路径
		let serverPath = httpConfig.path_face;
		serverPath = `${serverPath}${serverPath.endsWith(`/`) ? `` : `/`}`;
		app.downloader.downloadFile({
			url: `${serverPath}${app.file.getServerImageDir(serverPicID)}/${serverPicID}`,
			finalPath: `${app.file.getFileDir(app.file.FileDir.Copy)}editHead/${picName}`,
			bImage: true,
			onComplete: (err, spriteFrame) => {
				this.updateContentImage(spriteFrame);
			}
		});
	}
	protected initBtns(): boolean | void {
		//确定
		this.Items.Sprite_sure.onClickAndScale(() => {
			app.file.screenshot({
				node: this.Items.Mask_2,
				finalPath: `${app.file.getFileDir(app.file.FileDir.Copy)}editHead/screenshot.png`,
				callback: (data, uint8Array) => {
					if (typeof (data.outFilePath) == `string`) {
						this.updateContentImage(data.outFilePath);
						let nUserID = center.user.getUserID().toString();
						let arrayBuffer = app.file.getDataFromFile(data.outFilePath);
						let fileMd5 = app.md5.hashArrayBuffer(new Uint8Array(arrayBuffer));
						let customFormData = new CustomFormData();
						customFormData.append(`sendfile`, arrayBuffer, `file.png`);
						customFormData.append(`filename`, `icon.png`);
						customFormData.append(`uid`, nUserID);
						customFormData.append(`token`, app.md5.hashStr(`${nUserID}${fileMd5}ledou2016`));
						customFormData.append(`gametype`, `1`);
						app.http.post({
							url: httpConfig.path_icon,
							body: customFormData,
							callback: (bSuccess, response) => {
								if (bSuccess) {
									if (!fw.isNull(response)) {
										if (response.status > 0) {
											center.user.setActorMD5Face(response.info);
											if (fw.isValid(this)) {
												this.onClickClose();
											}
										} else {
											fw.printWarn(response.info);
										}
									}
									if (fw.isValid(this)) {
										this.onClickClose();
									}
								} else {
									fw.printError(`upload head faild!`);
								}
							}
						});
					} else {
						let canvas = document.createElement('canvas');
						canvas.height = data.outSize.height;
						canvas.width = data.outSize.width;
						var ctx = canvas.getContext(`2d`);
						var imgData = ctx.createImageData(data.outSize.width, data.outSize.height);
						for (var i = 0, j = uint8Array, k = j.length; i < k; i += 4) {
							//red
							imgData.data[i] = j[i];
							//green
							imgData.data[i + 1] = j[i + 1];
							//blue
							imgData.data[i + 2] = j[i + 2];
							//alpha
							imgData.data[i + 3] = j[i + 3];
						}
						ctx.putImageData(imgData, 0, 0);
						let base64 = canvas.toDataURL(`image/png`);
						let nUserID = center.user.getUserID().toString();
						let file = app.func.base64ToFile(base64);
						let reader = new FileReader();
						reader.onload = (e) => {
							let fileMd5 = app.md5.hashArrayBuffer(new Uint8Array(<ArrayBuffer>e.target.result));
							let form = new FormData();
							form.set('sendfile', file);
							form.set('filename', `icon.png`);
							form.set('uid', nUserID);
							form.set('token', app.md5.hashStr(`${nUserID}${fileMd5}ledou2016`));
							form.set('gametype', `1`);
							app.http.post({
								url: httpConfig.path_icon,
								body: form,
								callback: (bSuccess, response) => {
									if (bSuccess) {
										if (!fw.isNull(response)) {
											if (response.status > 0) {
												center.user.setActorMD5Face(response.info);
												if (fw.isValid(this)) {
													this.onClickClose();
												}
											} else {
												fw.printWarn(response.info);
											}
										}
									} else {
										fw.printError(`upload head faild!`);
									}
								}
							});
						};
						reader.readAsArrayBuffer(file);
						canvas.remove();
					}
				}
			});
		});
		//选择
		this.Items.Sprite_select.onClickAndScale(() => {
			if (app.func.isBrowser()) {
				app.file.openSelectFile({
					type: app.file.READ_FILE_TYPE.Data_Url,
					callback: (content: string, file: File) => {
						(<any>this).file = file;
						app.func.base64ToSpriteFrame(content, (spriteFrame) => {
							this.updateContentImage(spriteFrame);
						});
					}
				});
			} else {
				if (app.native.device.hasPermissions(`android.permission.READ_EXTERNAL_STORAGE`)) {
					app.native.device.pickFromGallery(`${app.file.getFileDir(app.file.FileDir.Copy)}editHead/head.png`);
				} else {
					app.native.device.requestPermissions(`Request permission to read external files`, 1, `android.permission.READ_EXTERNAL_STORAGE`)
				}
			}
		});
		//win32使用滑轮缩放
		if (app.func.isWin32()) {
			this.Items.Sprite_area.on(ccNode.EventType.MOUSE_WHEEL, (t: EventMouse) => {
				this.updateContentScale(t.getScrollY() * this.adaptDiffScale * 0.0001);
			});
		}
		//Sprite_area点击滑动
		this.Items.Sprite_area.on(ccNode.EventType.TOUCH_START, (t: EventTouch) => {
			this.imgPos = this.Items.Sprite_content.getPosition();
		});
		this.Items.Sprite_area.on(ccNode.EventType.TOUCH_MOVE, (t: EventTouch) => {
			let touchs = t.getAllTouches();
			let nTouchsLen = touchs.length;
			//单点触摸（调整位置）
			if (nTouchsLen == 1) {
				this.updateContentPos(t.getUIDelta());
				return;
			}
			//两点触摸（调整缩放）
			if (nTouchsLen == 2) {
				let touch1 = touchs[0];
				let touch2 = touchs[1];
				let sPos1 = touch1.getStartLocation();
				let sPos2 = touch2.getStartLocation();
				let ePos1 = touch1.getLocation();
				let ePos2 = touch2.getLocation();
				let nLen = ePos1.subtract(ePos2).length() - sPos1.subtract(sPos2).length();
				this.updateContentScale(nLen * this.adaptDiffScale * 0.00005);
				return;
			}
		});
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: `CameraPicture`,
			callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
				this.updateContentImage(arg1.data);
			}
		});
	}
	/**调整图片位置 */
	updateContentPos(fPos: Vec2 | Vec3) {
		let pos = fw.v3(this.imgPos).add3f(fPos.x, fPos.y, 0);
		this.Items.Sprite_content.setPosition(pos);
		//记录数据
		let nDiff1: number;
		let nDiff2: number;
		let scale1 = this.Items.Mask_2.getScale();
		let scale2 = this.Items.Sprite_content.getScale();
		let wPos1 = this.Items.Mask_2.getWorldPosition();
		let wPos2 = this.Items.Sprite_content.getWorldPosition();
		let uiTransform1 = this.Items.Mask_2.getComponent(UITransform);
		let uiTransform2 = this.Items.Sprite_content.getComponent(UITransform);
		let anchorPoint1 = uiTransform1.anchorPoint;
		let anchorPoint2 = uiTransform2.anchorPoint;
		//左
		nDiff1 = wPos1.x - uiTransform1.contentSize.width * scale1.x * anchorPoint1.x;
		nDiff2 = wPos2.x - uiTransform2.contentSize.width * scale2.x * anchorPoint2.x;
		if (nDiff1 < nDiff2) {
			pos.x -= nDiff2 - nDiff1;
		}
		//右
		nDiff1 = wPos1.x + uiTransform1.contentSize.width * scale1.x * (1 - anchorPoint1.x);
		nDiff2 = wPos2.x + uiTransform2.contentSize.width * scale2.x * (1 - anchorPoint2.x);
		if (nDiff1 > nDiff2) {
			pos.x += nDiff1 - nDiff2;
		}
		//上
		nDiff1 = wPos1.y + uiTransform1.contentSize.height * scale1.y * (1 - anchorPoint1.y);
		nDiff2 = wPos2.y + uiTransform2.contentSize.height * scale2.y * (1 - anchorPoint2.y);
		if (nDiff1 > nDiff2) {
			pos.y += nDiff1 - nDiff2;
		}
		//下
		nDiff1 = wPos1.y - uiTransform1.contentSize.height * scale1.y * anchorPoint1.y;
		nDiff2 = wPos2.y - uiTransform2.contentSize.height * scale2.y * anchorPoint2.y;
		if (nDiff1 < nDiff2) {
			pos.y -= nDiff2 - nDiff1;
		}
		this.Items.Sprite_content.setPosition(pos);
		//调整锚点
		this.updateAnchorPoint();
	}
	/**调整图片缩放 */
	updateContentScale(fScale: number) {
		this.Items.Sprite_content.getScale(fw._v3);
		//过小
		if (fw._v3.x + fScale < this.adaptMinScale) {
			fScale = this.adaptMinScale - fw._v3.x;
		}
		//过大
		if (fw._v3.x + fScale > this.adaptMaxScale) {
			fScale = this.adaptMaxScale - fw._v3.x;
		}
		this.Items.Sprite_content.setScale(fw._v3.add3f(fScale, fScale, 0));
		//校验位置
		this.updateContentPos(fw.v3());
	}
	/**调整图片 */
	updateContentImage(path: string | BundleResConfig | SpriteFrame) {
		let node = this.Items.Sprite_content;
		if (typeof (path) == `string`) {
			if (app.file.isFileExist(path) && !app.file.isDirectoryExist(path)) {
				app.assetManager.loadRemote<ImageAsset>({
					url: path,
					bCleanCache: true,
					callback: (imageAsset) => {
						node.setSpriteFrameByImageAsset(imageAsset);
						//调整尺寸
						node.setPosition(fw.v3(0, 0));
						this.checkImageSize();
					}
				});
			}
		} else {
			if (path instanceof SpriteFrame) {
				//调整显示
				node.getComponent(Sprite).spriteFrame = path;
				//调整尺寸
				node.setPosition(fw.v3(0, 0));
				this.checkImageSize();
			} else {
				node.loadBundleRes(path,(res: SpriteFrame) => {
					//调整显示
					let sprite = node.getComponent(Sprite);
					sprite.spriteFrame = res;
					//调整尺寸
					node.setPosition(fw.v3(0, 0));
					this.checkImageSize();
				},{
					failCallback:() => {
						fw.printError(`图片加载异常: ${path ? path.all : `null`}`);
					}
				});
			}
		}
	}
	/**调整图片尺寸 */
	checkImageSize() {
		let scale = 1;
		let size1 = this.Items.Mask_2.size;
		let size2 = this.Items.Sprite_content.size;
		//宽高比
		if ((size2.width / size2.height) > (size1.width / size1.height)) {
			scale = size1.height / size2.height;
		} else {
			scale = size1.width / size2.width;
		}
		let maxScale = 10;
		this.adaptMinScale = scale;
		this.adaptMaxScale = scale * maxScale;
		this.adaptDiffScale = this.adaptMaxScale - this.adaptMinScale;
		this.Items.Sprite_content.setScale(fw.v3(this.adaptMinScale, this.adaptMinScale, 1));
		//调整锚点
		this.updateAnchorPoint();
		//校验位置
		this.updateContentPos(fw.v3());
	}
	/**刷新锚点位置 */
	updateAnchorPoint() {
		this.Items.Mask_2.getWorldPosition(fw._v3);
		this.Items.Sprite_content.inverseTransformPoint(fw._v3, fw._v3);
		let uiTransform = this.Items.Sprite_content.getComponent(UITransform);
		let size = this.Items.Sprite_content.size;
		fw._v3.x += size.width * uiTransform.anchorX;
		fw._v3.y += size.height * uiTransform.anchorY;
		uiTransform.setAnchorPoint(fw._v3.x / size.width, fw._v3.y / size.height);
		this.Items.Sprite_content.setPosition(fw.v3());
	}
}
