import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type FooterMultiColumnDocumentDataSlicesSlice = FooterLinkBlockSlice

type FooterMultiColumnDocumentDataSlices1Slice = FooterLinkBlockSlice

type FooterMultiColumnDocumentDataSlices2Slice = FooterLinkBlockSlice

/**
 * Content for Footer Multi Column documents
 */
interface FooterMultiColumnDocumentData {
	/**
	 * Slice Zone field in *Footer Multi Column*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer_multi_column.slices[]
	 * - **Tab**: Column 1
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<FooterMultiColumnDocumentDataSlicesSlice>;/**
	 * Slice Zone field in *Footer Multi Column*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer_multi_column.slices1[]
	 * - **Tab**: Column 2
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices1: prismic.SliceZone<FooterMultiColumnDocumentDataSlices1Slice>;/**
	 * Slice Zone field in *Footer Multi Column*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer_multi_column.slices2[]
	 * - **Tab**: Column 3
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices2: prismic.SliceZone<FooterMultiColumnDocumentDataSlices2Slice>;
}

/**
 * Footer Multi Column document from Prismic
 *
 * - **API ID**: `footer_multi_column`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type FooterMultiColumnDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<FooterMultiColumnDocumentData>, "footer_multi_column", Lang>;

type HomepageDocumentDataSlicesSlice = EventsSlice | CarouselSlice | FaqSlice | ProcessSlice | TestimonialSlice | ImageWithTextSlice | FeaturesSlice | HeroSlice | RichTextSlice

/**
 * Content for Homepage documents
 */
interface HomepageDocumentData {
	/**
	 * Title field in *Homepage*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Homepage Title
	 * - **API ID Path**: homepage.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Slice Zone field in *Homepage*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomepageDocumentDataSlicesSlice>;/**
	 * Meta Description field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: homepage.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Meta Title field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: homepage.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
}

/**
 * Homepage document from Prismic
 *
 * - **API ID**: `homepage`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomepageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomepageDocumentData>, "homepage", Lang>;

/**
 * Item in *Layout → Social Media*
 */
export interface LayoutDocumentDataSocialMediaItem {
	/**
	 * Platform field in *Layout → Social Media*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: layout.social_media[].platform
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	platform: prismic.SelectField<"Facebook" | "Instagram" | "LinkedIn" | "TikTok" | "YouTube" | "Google">;
	
	/**
	 * Link field in *Layout → Social Media*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: layout.social_media[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "ghost" | "outline" | "destructive" | "link">;
}

type LayoutDocumentDataSlices1Slice = FooterMultiColumnSlice | FooterHeadingSlice

/**
 * Content for Layout documents
 */
interface LayoutDocumentData {
	/**
	 * CTA Link field in *Layout*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Enter a Call to Action
	 * - **API ID Path**: layout.cta_link
	 * - **Tab**: Header
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta_link: prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link">;
	
	/**
	 * Logo field in *Layout*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: layout.logo
	 * - **Tab**: Header
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Navigation field in *Layout*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Enter navigation links
	 * - **API ID Path**: layout.navigation
	 * - **Tab**: Header
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	navigation: prismic.Repeatable<prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link">>;/**
	 * Nonprofit Statement field in *Layout*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: layout.nonprofit_statement
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	nonprofit_statement: prismic.RichTextField;
	
	/**
	 * Privacy Link field in *Layout*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: layout.privacy_link
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	privacy_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Copyright field in *Layout*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: layout.copyright
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	copyright: prismic.KeyTextField;
	
	/**
	 * Social Media field in *Layout*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: layout.social_media[]
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	social_media: prismic.GroupField<Simplify<LayoutDocumentDataSocialMediaItem>>;
	
	/**
	 * Slice Zone field in *Layout*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: layout.slices1[]
	 * - **Tab**: Footer
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices1: prismic.SliceZone<LayoutDocumentDataSlices1Slice>;
}

/**
 * Layout document from Prismic
 *
 * - **API ID**: `layout`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type LayoutDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<LayoutDocumentData>, "layout", Lang>;

type PageDocumentDataSlicesSlice = EventsSlice | FormSlice | ContentIndexSlice | FeaturesSlice | FaqSlice | CarouselSlice | TestimonialSlice | ProcessSlice | ImageWithTextSlice | RichTextSlice | HeroSlice | OptOutSlice

/**
 * Content for Page documents
 */
interface PageDocumentData {
	/**
	 * TItle field in *Page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Parent field in *Page*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.parent
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	parent: ContentRelationshipFieldWithData<[{"id":"page","fields":["title",{"id":"parent","customtypes":[{"id":"page","fields":["title","parent"]}]}]}]>;
	
	/**
	 * Slice Zone field in *Page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<PageDocumentDataSlicesSlice>;/**
	 * Meta Description field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Meta Title field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
}

/**
 * Page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;

type PostDocumentDataSlicesSlice = TestimonialSlice | FaqSlice | ProcessSlice | RichTextSlice | ImageWithTextSlice | HeroSlice

/**
 * Content for Post documents
 */
interface PostDocumentData {
	/**
	 * Title field in *Post*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter the post title
	 * - **API ID Path**: post.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Excerpt field in *Post*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: post.excerpt
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	excerpt: prismic.RichTextField;
	
	/**
	 * Featured Image field in *Post*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: post.featured_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	featured_image: prismic.ImageField<never>;
	
	/**
	 * Slice Zone field in *Post*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: post.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<PostDocumentDataSlicesSlice>;/**
	 * Meta Description field in *Post*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: post.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Post*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: post.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Meta Title field in *Post*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: post.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
}

/**
 * Post document from Prismic
 *
 * - **API ID**: `post`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PostDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<PostDocumentData>, "post", Lang>;

/**
 * Content for Settings documents
 */
interface SettingsDocumentData {
	/**
	 * Domain field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.domain
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	domain: prismic.KeyTextField;
	
	/**
	 * Site Title field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.site_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	site_title: prismic.KeyTextField;
	
	/**
	 * Site Meta Description field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.site_meta_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	site_meta_description: prismic.KeyTextField;
	
	/**
	 * Site Meta Image field in *Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.site_meta_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	site_meta_image: prismic.ImageField<never>;
	
	/**
	 * Privacy Toast Message field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.privacy_toast_message
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	privacy_toast_message: prismic.KeyTextField;/**
	 * Country field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.country
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	country: prismic.KeyTextField;
	
	/**
	 * Legal Address PO Box field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.legal_po_box
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	legal_po_box: prismic.KeyTextField;
	
	/**
	 * Locality field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.locality
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	locality: prismic.KeyTextField;
	
	/**
	 * Legal Postal Code field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.legal_postal_code
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	legal_postal_code: prismic.KeyTextField;
	
	/**
	 * School Street Address field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.school_street_address
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	school_street_address: prismic.KeyTextField;
	
	/**
	 * School Postal Code field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.school_postal_code
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	school_postal_code: prismic.KeyTextField;
	
	/**
	 * Email field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.email
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	email: prismic.KeyTextField;
	
	/**
	 * Founding Date field in *Settings*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.founding_date
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	founding_date: prismic.DateField;
	
	/**
	 * Legal Name field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.legal_name
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	legal_name: prismic.KeyTextField;
	
	/**
	 * Logo field in *Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.logo
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Nonprofit Status field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.nonprofit_status
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	nonprofit_status: prismic.KeyTextField;
	
	/**
	 * Tax ID field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.tax_id
	 * - **Tab**: Schema
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tax_id: prismic.KeyTextField;
}

/**
 * Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SettingsDocumentData>, "settings", Lang>;

export type AllDocumentTypes = FooterMultiColumnDocument | HomepageDocument | LayoutDocument | PageDocument | PostDocument | SettingsDocument;

/**
 * Item in *Carousel → With Details → Primary → Items*
 */
export interface CarouselSliceWithDetailsPrimaryItemsItem {
	/**
	 * Name field in *Carousel → With Details → Primary → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: carousel.withDetails.primary.items[].name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Color field in *Carousel → With Details → Primary → Items*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: carousel.withDetails.primary.items[].color
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	color: prismic.ColorField;
	
	/**
	 * Logo field in *Carousel → With Details → Primary → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: carousel.withDetails.primary.items[].logo
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Link field in *Carousel → With Details → Primary → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: carousel.withDetails.primary.items[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Description field in *Carousel → With Details → Primary → Items*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: carousel.withDetails.primary.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
}

/**
 * Primary content in *Carousel → Default → Primary*
 */
export interface CarouselSliceDefaultPrimary {
	/**
	 * Title field in *Carousel → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: carousel.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
}

/**
 * Primary content in *Carousel → Items*
 */
export interface CarouselSliceDefaultItem {
	/**
	 * Image field in *Carousel → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: carousel.items[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Default variation for Carousel Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CarouselSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CarouselSliceDefaultPrimary>, Simplify<CarouselSliceDefaultItem>>;

/**
 * Primary content in *Carousel → With Details → Primary*
 */
export interface CarouselSliceWithDetailsPrimary {
	/**
	 * Heading field in *Carousel → With Details → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: carousel.withDetails.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Items field in *Carousel → With Details → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: carousel.withDetails.primary.items[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	items: prismic.GroupField<Simplify<CarouselSliceWithDetailsPrimaryItemsItem>>;
}

/**
 * With Details variation for Carousel Slice
 *
 * - **API ID**: `withDetails`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CarouselSliceWithDetails = prismic.SharedSliceVariation<"withDetails", Simplify<CarouselSliceWithDetailsPrimary>, never>;

/**
 * Slice variation for *Carousel*
 */
type CarouselSliceVariation = CarouselSliceDefault | CarouselSliceWithDetails

/**
 * Carousel Shared Slice
 *
 * - **API ID**: `carousel`
 * - **Description**: Carousel
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CarouselSlice = prismic.SharedSlice<"carousel", CarouselSliceVariation>;

/**
 * Primary content in *ContentIndex → Default → Primary*
 */
export interface ContentIndexSliceDefaultPrimary {
	/**
	 * Content Type field in *ContentIndex → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Select the content type to display
	 * - **Default Value**: post
	 * - **API ID Path**: content_index.default.primary.content_type
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	content_type: prismic.SelectField<"post" | "service", "filled">;
	
	/**
	 * Fallback Item Image field in *ContentIndex → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: content_index.default.primary.fallback_item_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	fallback_item_image: prismic.ImageField<never>;
	
	/**
	 * Number To Display field in *ContentIndex → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: content_index.default.primary.number_to_display
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	number_to_display: prismic.NumberField;
	
	/**
	 * Content CTA Text field in *ContentIndex → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: content_index.default.primary.content_cta_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	content_cta_text: prismic.KeyTextField;
}

/**
 * Default variation for ContentIndex Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ContentIndexSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ContentIndexSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ContentIndex*
 */
type ContentIndexSliceVariation = ContentIndexSliceDefault

/**
 * ContentIndex Shared Slice
 *
 * - **API ID**: `content_index`
 * - **Description**: ContentIndex
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ContentIndexSlice = prismic.SharedSlice<"content_index", ContentIndexSliceVariation>;

/**
 * Primary content in *Events → Default → Primary*
 */
export interface EventsSliceDefaultPrimary {
	/**
	 * Heading field in *Events → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: events.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Events → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: events.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Days Ahead field in *Events → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: How many days ahead to show?
	 * - **API ID Path**: events.default.primary.days_ahead
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	days_ahead: prismic.NumberField;
}

/**
 * Default variation for Events Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type EventsSliceDefault = prismic.SharedSliceVariation<"default", Simplify<EventsSliceDefaultPrimary>, never>;

/**
 * Primary content in *Events → Events Grid → Primary*
 */
export interface EventsSliceEventsGridPrimary {
	/**
	 * Heading field in *Events → Events Grid → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: events.eventsGrid.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Events → Events Grid → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: events.eventsGrid.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Days Ahead field in *Events → Events Grid → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: How many days ahead to show?
	 * - **API ID Path**: events.eventsGrid.primary.days_ahead
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	days_ahead: prismic.NumberField;
}

/**
 * Events Grid variation for Events Slice
 *
 * - **API ID**: `eventsGrid`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type EventsSliceEventsGrid = prismic.SharedSliceVariation<"eventsGrid", Simplify<EventsSliceEventsGridPrimary>, never>;

/**
 * Slice variation for *Events*
 */
type EventsSliceVariation = EventsSliceDefault | EventsSliceEventsGrid

/**
 * Events Shared Slice
 *
 * - **API ID**: `events`
 * - **Description**: Events
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type EventsSlice = prismic.SharedSlice<"events", EventsSliceVariation>;

/**
 * Item in *Faq → Default → Primary → Questions*
 */
export interface FaqSliceDefaultPrimaryQuestionsItem {
	/**
	 * Question field in *Faq → Default → Primary → Questions*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter the question text
	 * - **API ID Path**: faq.default.primary.questions[].question
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	question: prismic.RichTextField;
	
	/**
	 * Answer field in *Faq → Default → Primary → Questions*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Answer the question
	 * - **API ID Path**: faq.default.primary.questions[].answer
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	answer: prismic.RichTextField;
}

/**
 * Primary content in *Faq → Default → Primary*
 */
export interface FaqSliceDefaultPrimary {
	/**
	 * Heading field in *Faq → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: faq.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Type field in *Faq → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Mutiple allows more than 1 to be open
	 * - **Default Value**: multiple
	 * - **API ID Path**: faq.default.primary.type
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	type: prismic.SelectField<"multiple" | "single", "filled">;
	
	/**
	 * Border field in *Faq → Default → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: faq.default.primary.border
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	border: prismic.BooleanField;
	
	/**
	 * Collapsible field in *Faq → Default → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: faq.default.primary.collapsible
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	collapsible: prismic.BooleanField;
	
	/**
	 * Questions field in *Faq → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: faq.default.primary.questions[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	questions: prismic.GroupField<Simplify<FaqSliceDefaultPrimaryQuestionsItem>>;
}

/**
 * Default variation for Faq Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FaqSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FaqSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Faq*
 */
type FaqSliceVariation = FaqSliceDefault

/**
 * Faq Shared Slice
 *
 * - **API ID**: `faq`
 * - **Description**: Faq
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FaqSlice = prismic.SharedSlice<"faq", FaqSliceVariation>;

/**
 * Item in *Features → Default → Primary → Features*
 */
export interface FeaturesSliceDefaultPrimaryFeaturesItem {
	/**
	 * Feature Heading field in *Features → Default → Primary → Features*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.default.primary.features[].feature_heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	feature_heading: prismic.RichTextField;
	
	/**
	 * Feature Description field in *Features → Default → Primary → Features*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.default.primary.features[].feature_description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	feature_description: prismic.RichTextField;
	
	/**
	 * Button Link field in *Features → Default → Primary → Features*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.default.primary.features[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link">;
}

/**
 * Item in *Features → Secondary → Primary → Features*
 */
export interface FeaturesSliceSecondaryPrimaryFeaturesItem {
	/**
	 * Feature Heading field in *Features → Secondary → Primary → Features*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.secondary.primary.features[].feature_heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	feature_heading: prismic.RichTextField;
	
	/**
	 * Feature Description field in *Features → Secondary → Primary → Features*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.secondary.primary.features[].feature_description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	feature_description: prismic.RichTextField;
	
	/**
	 * Button Link field in *Features → Secondary → Primary → Features*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.secondary.primary.features[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link">;
}

/**
 * Item in *Features → Primary → Primary → Features*
 */
export interface FeaturesSlicePrimaryPrimaryFeaturesItem {
	/**
	 * Feature Heading field in *Features → Primary → Primary → Features*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.primary.primary.features[].feature_heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	feature_heading: prismic.RichTextField;
	
	/**
	 * Feature Description field in *Features → Primary → Primary → Features*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.primary.primary.features[].feature_description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	feature_description: prismic.RichTextField;
	
	/**
	 * Button Link field in *Features → Primary → Primary → Features*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.primary.primary.features[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link">;
}

/**
 * Primary content in *Features → Default → Primary*
 */
export interface FeaturesSliceDefaultPrimary {
	/**
	 * Heading field in *Features → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter section heading
	 * - **API ID Path**: features.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Features → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter short section description
	 * - **API ID Path**: features.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Features field in *Features → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.default.primary.features[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	features: prismic.GroupField<Simplify<FeaturesSliceDefaultPrimaryFeaturesItem>>;
}

/**
 * Default variation for Features Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturesSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FeaturesSliceDefaultPrimary>, never>;

/**
 * Primary content in *Features → Secondary → Primary*
 */
export interface FeaturesSliceSecondaryPrimary {
	/**
	 * Heading field in *Features → Secondary → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter section heading
	 * - **API ID Path**: features.secondary.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Features → Secondary → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter short section description
	 * - **API ID Path**: features.secondary.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Features field in *Features → Secondary → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.secondary.primary.features[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	features: prismic.GroupField<Simplify<FeaturesSliceSecondaryPrimaryFeaturesItem>>;
}

/**
 * Secondary variation for Features Slice
 *
 * - **API ID**: `secondary`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturesSliceSecondary = prismic.SharedSliceVariation<"secondary", Simplify<FeaturesSliceSecondaryPrimary>, never>;

/**
 * Primary content in *Features → Primary → Primary*
 */
export interface FeaturesSlicePrimaryPrimary {
	/**
	 * Heading field in *Features → Primary → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter section heading
	 * - **API ID Path**: features.primary.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Features → Primary → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter short section description
	 * - **API ID Path**: features.primary.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Features field in *Features → Primary → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: features.primary.primary.features[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	features: prismic.GroupField<Simplify<FeaturesSlicePrimaryPrimaryFeaturesItem>>;
}

/**
 * Primary variation for Features Slice
 *
 * - **API ID**: `primary`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturesSlicePrimary = prismic.SharedSliceVariation<"primary", Simplify<FeaturesSlicePrimaryPrimary>, never>;

/**
 * Slice variation for *Features*
 */
type FeaturesSliceVariation = FeaturesSliceDefault | FeaturesSliceSecondary | FeaturesSlicePrimary

/**
 * Features Shared Slice
 *
 * - **API ID**: `features`
 * - **Description**: Features
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturesSlice = prismic.SharedSlice<"features", FeaturesSliceVariation>;

/**
 * Primary content in *FooterHeading → Default → Primary*
 */
export interface FooterHeadingSliceDefaultPrimary {
	/**
	 * Heading field in *FooterHeading → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer_heading.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
}

/**
 * Default variation for FooterHeading Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FooterHeadingSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FooterHeadingSliceDefaultPrimary>, never>;

/**
 * Slice variation for *FooterHeading*
 */
type FooterHeadingSliceVariation = FooterHeadingSliceDefault

/**
 * FooterHeading Shared Slice
 *
 * - **API ID**: `footer_heading`
 * - **Description**: FooterHeading
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FooterHeadingSlice = prismic.SharedSlice<"footer_heading", FooterHeadingSliceVariation>;

/**
 * Primary content in *FooterLinkBlock → Default → Primary*
 */
export interface FooterLinkBlockSliceDefaultPrimary {
	/**
	 * Block Title field in *FooterLinkBlock → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer_link_block.default.primary.block_title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	block_title: prismic.KeyTextField;
}

/**
 * Primary content in *FooterLinkBlock → Items*
 */
export interface FooterLinkBlockSliceDefaultItem {
	/**
	 * Label field in *FooterLinkBlock → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer_link_block.items[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *FooterLinkBlock → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer_link_block.items[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Default variation for FooterLinkBlock Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FooterLinkBlockSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FooterLinkBlockSliceDefaultPrimary>, Simplify<FooterLinkBlockSliceDefaultItem>>;

/**
 * Slice variation for *FooterLinkBlock*
 */
type FooterLinkBlockSliceVariation = FooterLinkBlockSliceDefault

/**
 * FooterLinkBlock Shared Slice
 *
 * - **API ID**: `footer_link_block`
 * - **Description**: FooterLinkBlock
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FooterLinkBlockSlice = prismic.SharedSlice<"footer_link_block", FooterLinkBlockSliceVariation>;

/**
 * Primary content in *FooterMultiColumn → Default → Primary*
 */
export interface FooterMultiColumnSliceDefaultPrimary {
	/**
	 * Heading field in *FooterMultiColumn → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer_multi_column.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Layout field in *FooterMultiColumn → Default → Primary*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer_multi_column.default.primary.layout
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	layout: prismic.ContentRelationshipField<"footer_multi_column">;
}

/**
 * Default variation for FooterMultiColumn Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FooterMultiColumnSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FooterMultiColumnSliceDefaultPrimary>, never>;

/**
 * Slice variation for *FooterMultiColumn*
 */
type FooterMultiColumnSliceVariation = FooterMultiColumnSliceDefault

/**
 * FooterMultiColumn Shared Slice
 *
 * - **API ID**: `footer_multi_column`
 * - **Description**: FooterMultiColumn
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FooterMultiColumnSlice = prismic.SharedSlice<"footer_multi_column", FooterMultiColumnSliceVariation>;

/**
 * Primary content in *Form → Default → Primary*
 */
export interface FormSliceDefaultPrimary {
	/**
	 * Title field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Optionally add a title
	 * - **API ID Path**: form.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Description field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Name Label field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.name_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name_label: prismic.KeyTextField;
	
	/**
	 * Name Placeholder field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.name_placeholder
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name_placeholder: prismic.KeyTextField;
	
	/**
	 * Email Label field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.email_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	email_label: prismic.KeyTextField;
	
	/**
	 * Email Placeholder field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.email_placeholder
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	email_placeholder: prismic.KeyTextField;
	
	/**
	 * Phone Label field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.phone_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	phone_label: prismic.KeyTextField;
	
	/**
	 * Phone Placeholder field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.phone_placeholder
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	phone_placeholder: prismic.KeyTextField;
	
	/**
	 * Message Label field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.message_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	message_label: prismic.KeyTextField;
	
	/**
	 * Message Placeholder field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.message_placeholder
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	message_placeholder: prismic.KeyTextField;
	
	/**
	 * Button Text field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form.default.primary.button_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_text: prismic.KeyTextField;
	
	/**
	 * Button Style field in *Form → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: default
	 * - **API ID Path**: form.default.primary.button_style
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	button_style: prismic.SelectField<"default" | "secondary" | "outline" | "ghost" | "destructive" | "link", "filled">;
}

/**
 * Default variation for Form Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FormSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FormSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Form*
 */
type FormSliceVariation = FormSliceDefault

/**
 * Form Shared Slice
 *
 * - **API ID**: `form`
 * - **Description**: Form
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FormSlice = prismic.SharedSlice<"form", FormSliceVariation>;

/**
 * Primary content in *Hero → Default → Primary*
 */
export interface HeroSliceDefaultPrimary {
	/**
	 * Heading field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Benefit driven headline
	 * - **API ID Path**: hero.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Short: What, Who, How
	 * - **API ID Path**: hero.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Button Link field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Enter link
	 * - **API ID Path**: hero.default.primary.button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.Repeatable<prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link">>;
}

/**
 * Default variation for Hero Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceDefault = prismic.SharedSliceVariation<"default", Simplify<HeroSliceDefaultPrimary>, never>;

/**
 * Primary content in *Hero → With Image → Primary*
 */
export interface HeroSliceWithImagePrimary {
	/**
	 * Image field in *Hero → With Image → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.withImage.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Heading field in *Hero → With Image → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Benefit driven headline
	 * - **API ID Path**: hero.withImage.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Hero → With Image → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Short: What, Who, How
	 * - **API ID Path**: hero.withImage.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Button Link field in *Hero → With Image → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Enter link
	 * - **API ID Path**: hero.withImage.primary.button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.Repeatable<prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link">>;
}

/**
 * With Image variation for Hero Slice
 *
 * - **API ID**: `withImage`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceWithImage = prismic.SharedSliceVariation<"withImage", Simplify<HeroSliceWithImagePrimary>, never>;

/**
 * Primary content in *Hero → Content Height → Primary*
 */
export interface HeroSliceContentHeightPrimary {
	/**
	 * Image field in *Hero → Content Height → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.contentHeight.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Heading field in *Hero → Content Height → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Benefit driven headline
	 * - **API ID Path**: hero.contentHeight.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Hero → Content Height → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Short: What, Who, How
	 * - **API ID Path**: hero.contentHeight.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Button Link field in *Hero → Content Height → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Enter link
	 * - **API ID Path**: hero.contentHeight.primary.button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.Repeatable<prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link">>;
}

/**
 * Content Height variation for Hero Slice
 *
 * - **API ID**: `contentHeight`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceContentHeight = prismic.SharedSliceVariation<"contentHeight", Simplify<HeroSliceContentHeightPrimary>, never>;

/**
 * Slice variation for *Hero*
 */
type HeroSliceVariation = HeroSliceDefault | HeroSliceWithImage | HeroSliceContentHeight

/**
 * Hero Shared Slice
 *
 * - **API ID**: `hero`
 * - **Description**: Hero
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSlice = prismic.SharedSlice<"hero", HeroSliceVariation>;

/**
 * Primary content in *ImageWithText → Default → Primary*
 */
export interface ImageWithTextSliceDefaultPrimary {
	/**
	 * Text field in *ImageWithText → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter your text here
	 * - **API ID Path**: image_with_text.default.primary.text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
	
	/**
	 * Image field in *ImageWithText → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_with_text.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Default variation for ImageWithText Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageWithTextSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ImageWithTextSliceDefaultPrimary>, never>;

/**
 * Primary content in *ImageWithText → Right Image → Primary*
 */
export interface ImageWithTextSliceRightImagePrimary {
	/**
	 * Text field in *ImageWithText → Right Image → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter your text here
	 * - **API ID Path**: image_with_text.rightImage.primary.text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
	
	/**
	 * Image field in *ImageWithText → Right Image → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_with_text.rightImage.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Right Image variation for ImageWithText Slice
 *
 * - **API ID**: `rightImage`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageWithTextSliceRightImage = prismic.SharedSliceVariation<"rightImage", Simplify<ImageWithTextSliceRightImagePrimary>, never>;

/**
 * Slice variation for *ImageWithText*
 */
type ImageWithTextSliceVariation = ImageWithTextSliceDefault | ImageWithTextSliceRightImage

/**
 * ImageWithText Shared Slice
 *
 * - **API ID**: `image_with_text`
 * - **Description**: ImageWithText
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageWithTextSlice = prismic.SharedSlice<"image_with_text", ImageWithTextSliceVariation>;

/**
 * Default variation for OptOut Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type OptOutSliceDefault = prismic.SharedSliceVariation<"default", Record<string, never>, never>;

/**
 * Slice variation for *OptOut*
 */
type OptOutSliceVariation = OptOutSliceDefault

/**
 * OptOut Shared Slice
 *
 * - **API ID**: `opt_out`
 * - **Description**: OptOut
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type OptOutSlice = prismic.SharedSlice<"opt_out", OptOutSliceVariation>;

/**
 * Primary content in *Process → Default → Primary*
 */
export interface ProcessSliceDefaultPrimary {
	/**
	 * Title field in *Process → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Optionally add a section title
	 * - **API ID Path**: process.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Heading field in *Process → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter process heading
	 * - **API ID Path**: process.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Process → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Optionally describe the process
	 * - **API ID Path**: process.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
}

/**
 * Primary content in *Process → Items*
 */
export interface ProcessSliceDefaultItem {
	/**
	 * Icon field in *Process → Items*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Optionally select an icon
	 * - **API ID Path**: process.items[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"message" | "call" | "people">;
	
	/**
	 * Step Title field in *Process → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: process.items[].step_title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	step_title: prismic.KeyTextField;
	
	/**
	 * description field in *Process → Items*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Describe this step
	 * - **API ID Path**: process.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Button Label field in *Process → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Optionally add a button
	 * - **API ID Path**: process.items[].button_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_label: prismic.KeyTextField;
	
	/**
	 * Button Link field in *Process → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Add a link
	 * - **API ID Path**: process.items[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Default variation for Process Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProcessSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ProcessSliceDefaultPrimary>, Simplify<ProcessSliceDefaultItem>>;

/**
 * Slice variation for *Process*
 */
type ProcessSliceVariation = ProcessSliceDefault

/**
 * Process Shared Slice
 *
 * - **API ID**: `process`
 * - **Description**: Process
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProcessSlice = prismic.SharedSlice<"process", ProcessSliceVariation>;

/**
 * Primary content in *RichText → Default → Primary*
 */
export interface RichTextSliceDefaultPrimary {
	/**
	 * Rich Text field in *RichText → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Rich Text Content
	 * - **API ID Path**: rich_text.default.primary.rich_text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	rich_text: prismic.RichTextField;
}

/**
 * Default variation for RichText Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RichTextSliceDefault = prismic.SharedSliceVariation<"default", Simplify<RichTextSliceDefaultPrimary>, never>;

/**
 * Primary content in *RichText → Secondary → Primary*
 */
export interface RichTextSliceSecondaryPrimary {
	/**
	 * Rich Text field in *RichText → Secondary → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Rich Text Content
	 * - **API ID Path**: rich_text.secondary.primary.rich_text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	rich_text: prismic.RichTextField;
}

/**
 * Secondary variation for RichText Slice
 *
 * - **API ID**: `secondary`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RichTextSliceSecondary = prismic.SharedSliceVariation<"secondary", Simplify<RichTextSliceSecondaryPrimary>, never>;

/**
 * Slice variation for *RichText*
 */
type RichTextSliceVariation = RichTextSliceDefault | RichTextSliceSecondary

/**
 * RichText Shared Slice
 *
 * - **API ID**: `rich_text`
 * - **Description**: RichText
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RichTextSlice = prismic.SharedSlice<"rich_text", RichTextSliceVariation>;

/**
 * Primary content in *Testimonial → Default → Primary*
 */
export interface TestimonialSliceDefaultPrimary {
	/**
	 * Quote field in *Testimonial → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter quote here
	 * - **API ID Path**: testimonial.default.primary.quote
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	quote: prismic.RichTextField;
	
	/**
	 * Name field in *Testimonial → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Enter quote author
	 * - **API ID Path**: testimonial.default.primary.name
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	name: prismic.RichTextField;
}

/**
 * Default variation for Testimonial Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TestimonialSliceDefault = prismic.SharedSliceVariation<"default", Simplify<TestimonialSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Testimonial*
 */
type TestimonialSliceVariation = TestimonialSliceDefault

/**
 * Testimonial Shared Slice
 *
 * - **API ID**: `testimonial`
 * - **Description**: Testimonial
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TestimonialSlice = prismic.SharedSlice<"testimonial", TestimonialSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			FooterMultiColumnDocument,
			FooterMultiColumnDocumentData,
			FooterMultiColumnDocumentDataSlicesSlice,
			FooterMultiColumnDocumentDataSlices1Slice,
			FooterMultiColumnDocumentDataSlices2Slice,
			HomepageDocument,
			HomepageDocumentData,
			HomepageDocumentDataSlicesSlice,
			LayoutDocument,
			LayoutDocumentData,
			LayoutDocumentDataSocialMediaItem,
			LayoutDocumentDataSlices1Slice,
			PageDocument,
			PageDocumentData,
			PageDocumentDataSlicesSlice,
			PostDocument,
			PostDocumentData,
			PostDocumentDataSlicesSlice,
			SettingsDocument,
			SettingsDocumentData,
			AllDocumentTypes,
			CarouselSlice,
			CarouselSliceDefaultPrimary,
			CarouselSliceDefaultItem,
			CarouselSliceWithDetailsPrimaryItemsItem,
			CarouselSliceWithDetailsPrimary,
			CarouselSliceVariation,
			CarouselSliceDefault,
			CarouselSliceWithDetails,
			ContentIndexSlice,
			ContentIndexSliceDefaultPrimary,
			ContentIndexSliceVariation,
			ContentIndexSliceDefault,
			EventsSlice,
			EventsSliceDefaultPrimary,
			EventsSliceEventsGridPrimary,
			EventsSliceVariation,
			EventsSliceDefault,
			EventsSliceEventsGrid,
			FaqSlice,
			FaqSliceDefaultPrimaryQuestionsItem,
			FaqSliceDefaultPrimary,
			FaqSliceVariation,
			FaqSliceDefault,
			FeaturesSlice,
			FeaturesSliceDefaultPrimaryFeaturesItem,
			FeaturesSliceDefaultPrimary,
			FeaturesSliceSecondaryPrimaryFeaturesItem,
			FeaturesSliceSecondaryPrimary,
			FeaturesSlicePrimaryPrimaryFeaturesItem,
			FeaturesSlicePrimaryPrimary,
			FeaturesSliceVariation,
			FeaturesSliceDefault,
			FeaturesSliceSecondary,
			FeaturesSlicePrimary,
			FooterHeadingSlice,
			FooterHeadingSliceDefaultPrimary,
			FooterHeadingSliceVariation,
			FooterHeadingSliceDefault,
			FooterLinkBlockSlice,
			FooterLinkBlockSliceDefaultPrimary,
			FooterLinkBlockSliceDefaultItem,
			FooterLinkBlockSliceVariation,
			FooterLinkBlockSliceDefault,
			FooterMultiColumnSlice,
			FooterMultiColumnSliceDefaultPrimary,
			FooterMultiColumnSliceVariation,
			FooterMultiColumnSliceDefault,
			FormSlice,
			FormSliceDefaultPrimary,
			FormSliceVariation,
			FormSliceDefault,
			HeroSlice,
			HeroSliceDefaultPrimary,
			HeroSliceWithImagePrimary,
			HeroSliceContentHeightPrimary,
			HeroSliceVariation,
			HeroSliceDefault,
			HeroSliceWithImage,
			HeroSliceContentHeight,
			ImageWithTextSlice,
			ImageWithTextSliceDefaultPrimary,
			ImageWithTextSliceRightImagePrimary,
			ImageWithTextSliceVariation,
			ImageWithTextSliceDefault,
			ImageWithTextSliceRightImage,
			OptOutSlice,
			OptOutSliceVariation,
			OptOutSliceDefault,
			ProcessSlice,
			ProcessSliceDefaultPrimary,
			ProcessSliceDefaultItem,
			ProcessSliceVariation,
			ProcessSliceDefault,
			RichTextSlice,
			RichTextSliceDefaultPrimary,
			RichTextSliceSecondaryPrimary,
			RichTextSliceVariation,
			RichTextSliceDefault,
			RichTextSliceSecondary,
			TestimonialSlice,
			TestimonialSliceDefaultPrimary,
			TestimonialSliceVariation,
			TestimonialSliceDefault
		}
	}
}