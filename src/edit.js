/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Controls from './components/controls';
import Loading from './components/loading';
import Preview from './components/preview';
import Placeholder from './components/placeholder';
import fetchBookmark from './api';

const NEW_TAB_REL = 'noreferrer noopener';

export default class Edit extends Component {
	constructor() {
		super( ...arguments );
		this.onSubmit = this.onSubmit.bind( this );
		this.switchBackToURLInput = this.switchBackToURLInput.bind( this );
		this.onSetLinkTarget = this.onSetLinkTarget.bind( this );
		this.onSetLinkRel = this.onSetLinkRel.bind( this );

		this.state = {
			fetching: false,
			editingURL: false,
			url: this.props.attributes.url,
		};
	}

	onSubmit( event ) {
		if ( event ) {
			event.preventDefault();
		}

		const { url } = this.state;
		const { setAttributes } = this.props;

		this.setState( { editingURL: false, fetching: true } );

		fetchBookmark( url )
			.then( ( response ) => {
				setAttributes( { ...response } );
				this.setState( { editingURL: false, fetching: false } );
			} )
			.catch( () => {
				// @todo display notice.
				this.setState( { editingURL: true, fetching: false } );
			} );
	}

	switchBackToURLInput() {
		this.setState( { editingURL: true } );
	}

	onSetLinkTarget( value ) {
		const {
			attributes: { rel },
			setAttributes,
		} = this.props;
		const newLinkTarget = value ? '_blank' : undefined;

		let updatedRel = rel;
		if ( newLinkTarget && ! rel ) {
			updatedRel = NEW_TAB_REL;
		} else if ( ! newLinkTarget && rel === NEW_TAB_REL ) {
			updatedRel = undefined;
		}

		setAttributes( {
			linkTarget: newLinkTarget,
			rel: updatedRel,
		} );
	}

	onSetLinkRel( value ) {
		this.props.setAttributes( { rel: value } );
	}

	render() {
		const { url, fetching, editingURL } = this.state;
		const { attributes, className, isSelected } = this.props;
		const { title, rel, linkTarget } = attributes;

		if ( fetching ) {
			return <Loading />;
		}

		const showPlaceholder = ! title || editingURL;
		if ( showPlaceholder ) {
			return (
				<Placeholder
					onSubmit={ this.onSubmit }
					value={ url }
					onChange={ ( event ) =>
						this.setState( { url: event.target.value } )
					}
				/>
			);
		}

		return (
			<>
				<Controls
					rel={ rel }
					linkTarget={ linkTarget }
					showEditButton={ url }
					switchBackToURLInput={ this.switchBackToURLInput }
					onSetLinkTarget={ this.onSetLinkTarget }
					onSetLinkRel={ this.onSetLinkRel }
				/>
				<Preview
					bookmark={ attributes }
					className={ className }
					isSelected={ isSelected }
				/>
			</>
		);
	}
}
