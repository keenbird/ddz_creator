import { _decorator, Node as ccNode, EditBox, HorizontalTextAlignment, Label, Size, VerticalTextAlignment } from 'cc';
const { ccclass, executeInEditMode } = _decorator;

const LEFT_PADDING = 2;

@ccclass('FWEditBox')
@executeInEditMode
export class FWEditBox extends EditBox {
	protected _updateTextLabel() {
		let textLabel = this._textLabel;

		if (!textLabel) {
			let node = this.node.getChildByName('TEXT_LABEL');
			if (!node) {
				node = new ccNode('TEXT_LABEL');
				node.layer = this.node.layer;
			}
			textLabel = node.getComponent(Label);
			if (!textLabel) {
				textLabel = node.addComponent(Label);
			}
			node.parent = this.node;
			this._textLabel = textLabel;
			textLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
			textLabel.verticalAlign = VerticalTextAlignment.CENTER;
			textLabel.horizontalAlign = HorizontalTextAlignment.LEFT;
		}

		const transformComp = this._textLabel!.node._uiProps.uiTransformComp;
		transformComp!.setAnchorPoint(0, 1);
		// textLabel.overflow = Label.Overflow.CLAMP;
		// if (this._inputMode === EditBox.InputMode.ANY) {
		// 	textLabel.verticalAlign = VerticalTextAlignment.TOP;
		// 	textLabel.enableWrapText = true;
		// } else {
		// 	textLabel.enableWrapText = false;
		// }
		textLabel.string = this._updateLabelStringStyle(this._string);
	}

	protected _updatePlaceholderLabel() {
		let placeholderLabel = this._placeholderLabel;

		if (!placeholderLabel) {
			let node = this.node.getChildByName('PLACEHOLDER_LABEL');
			if (!node) {
				node = new ccNode('PLACEHOLDER_LABEL');
				node.layer = this.node.layer;
			}
			placeholderLabel = node.getComponent(Label);
			if (!placeholderLabel) {
				placeholderLabel = node.addComponent(Label);
			}
			node.parent = this.node;
			this._placeholderLabel = placeholderLabel;
			placeholderLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
			placeholderLabel.verticalAlign = VerticalTextAlignment.CENTER;
			placeholderLabel.horizontalAlign = HorizontalTextAlignment.LEFT;
		}

		const transform = this._placeholderLabel!.node._uiProps.uiTransformComp;
		transform!.setAnchorPoint(0, 1);
		// if (this._inputMode === EditBox.InputMode.ANY) {
		// 	placeholderLabel.enableWrapText = true;
		// } else {
		// 	placeholderLabel.enableWrapText = false;
		// }
		placeholderLabel.string = this.placeholder;
	}
	protected _updateLabelPosition(size: Size) {
		const trans = this.node._uiProps.uiTransformComp!;
		const offX = -trans.anchorX * trans.width;
		const offY = -trans.anchorY * trans.height;

		const placeholderLabel = this._placeholderLabel;
		const textLabel = this._textLabel;
		if (textLabel) {
			// textLabel.node._uiProps.uiTransformComp!.setContentSize(size.width - LEFT_PADDING, size.height);
			textLabel.node.setPosition(offX + LEFT_PADDING, offY + size.height, textLabel.node.position.z);
			// if (this._inputMode === EditBox.InputMode.ANY) {
			// 	textLabel.verticalAlign = VerticalTextAlignment.TOP;
			// }
			textLabel.enableWrapText = this._inputMode === EditBox.InputMode.ANY;
		}

		if (placeholderLabel) {
			// placeholderLabel.node._uiProps.uiTransformComp!.setContentSize(size.width - LEFT_PADDING, size.height);
			// placeholderLabel.lineHeight = size.height;
			placeholderLabel.node.setPosition(offX + LEFT_PADDING, offY + size.height, placeholderLabel.node.position.z);
			placeholderLabel.enableWrapText = this._inputMode === EditBox.InputMode.ANY;
		}
	}
}
