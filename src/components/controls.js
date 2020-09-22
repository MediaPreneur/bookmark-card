/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
	Toolbar,
} from '@wordpress/components';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';

export default function Controls( {
	rel,
	linkTarget,
	showEditButton,
	switchBackToURLInput,
	onSetLinkTarget,
	onSetLinkRel,
} ) {
	return (
		<>
			<BlockControls>
				<Toolbar>
					{ showEditButton && (
						<Button
							className="components-toolbar__control"
							label={ __( 'Edit URL', 'bookmark-card' ) }
							icon="edit"
							onClick={ switchBackToURLInput }
						/>
					) }
				</Toolbar>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Link settings', 'bookmark-card' ) }>
					<ToggleControl
						label={ __( 'Open in new tab', 'bookmark-card' ) }
						onChange={ onSetLinkTarget }
						checked={ linkTarget === '_blank' }
					/>
					<TextControl
						label={ __( 'Link rel', 'bookmark-card' ) }
						value={ rel || '' }
						onChange={ onSetLinkRel }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
