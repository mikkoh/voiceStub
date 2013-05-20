define( [ 'lib/jquery', 'lib/TweenLite' ], function( $, TweenLite ) {
	var UIRecordBtn = function( container ) {
		this.parentContainer = container;
	};

	UIRecordBtn.prototype.parentContainer = null;
	UIRecordBtn.prototype.container = null;
	UIRecordBtn.prototype.isRecording = false;

	UIRecordBtn.prototype.init = function() {
		this.container = $( '<div>' +
								'<img id="notRecording" src="images/recordBtn.png" width="81" height="80" />' +
								'<img id="recording" src="images/recordBtnRecording.png" width="81" height="80" />' +
							'</div>' ).appendTo( this.parentContainer );

		this.imgNotRecording = this.container.find( '#notRecording' );
		this.imgRecording = this.container.find( '#recording' );

		this.container
		.css( 'width', 45 )
		.css( 'height', 45 )
		.css( 'position', 'relative' );

		this.imgNotRecording
		.css( 'top', -9 )
		.css( 'left', -13 )
		.css( 'position', 'absolute' );

		this.imgRecording
		.css( 'top', -9 )
		.css( 'left', -13 )
		.css( 'visibility', 'hidden' )
		.css( 'opacity', 0 )
		.css( 'position', 'absolute' );
	};

	UIRecordBtn.prototype.startRecord = function() {
		this.isRecording = true;

		TweenLite.to( this.imgNotRecording, 0.3, { autoAlpha: 0 } );
		TweenLite.to( this.imgRecording, 0.3, { autoAlpha: 1 } );
	};

	UIRecordBtn.prototype.stopRecord = function() {
		this.isRecording = false;

		TweenLite.to( this.imgNotRecording, 0.3, { autoAlpha: 1 } );
		TweenLite.to( this.imgRecording, 0.3, { autoAlpha: 0 } );
	};

	UIRecordBtn.prototype._onClick = function() {
		if( this.isRecording ) {
			this.stopRecord();
		} else {
			this.startRecord();
		}
	};

	return UIRecordBtn;
});