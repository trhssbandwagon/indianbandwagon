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

/**
 * Content for Board Member documents
 */
interface BoardMemberDocumentData {
	/**
	 * Name field in *Board Member*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Board member's name
	 * - **API ID Path**: board_member.name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Portrait field in *Board Member*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: board_member.portrait
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	portrait: prismic.ImageField<never>;
	
	/**
	 * Link field in *Board Member*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Share a link to board member's social media
	 * - **API ID Path**: board_member.link
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Board Member document from Prismic
 *
 * - **API ID**: `board_member`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type BoardMemberDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<BoardMemberDocumentData>, "board_member", Lang>;

/**
 * Content for Board Position documents
 */
interface BoardPositionDocumentData {
	/**
	 * Title field in *Board Position*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: board_position.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
}

/**
 * Board Position document from Prismic
 *
 * - **API ID**: `board_position`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type BoardPositionDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<BoardPositionDocumentData>, "board_position", Lang>;

/**
 * Item in *Executive Board → Members*
 */
export interface ExecutiveBoardDocumentDataMembersItem {
	/**
	 * Member field in *Executive Board → Members*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: executive_board.members[].member
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	member: ContentRelationshipFieldWithData<[{"fields":["name",{"customtypes":[{"fields":["title"],"id":"board_position"}],"id":"position"},"portrait","link"],"id":"board_member"}]>;
	
	/**
	 * Position field in *Executive Board → Members*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: executive_board.members[].position
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	position: ContentRelationshipFieldWithData<[{"fields":["title"],"id":"board_position"}]>;
}

/**
 * Content for Executive Board documents
 */
interface ExecutiveBoardDocumentData {
	/**
	 * Title field in *Executive Board*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: executive_board.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Start field in *Executive Board*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: Date the exec board starts
	 * - **API ID Path**: executive_board.start
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	start: prismic.DateField;
	
	/**
	 * End field in *Executive Board*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: Date the exec board ends
	 * - **API ID Path**: executive_board.end
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	end: prismic.DateField;
	
	/**
	 * Members field in *Executive Board*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: executive_board.members[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	members: prismic.GroupField<Simplify<ExecutiveBoardDocumentDataMembersItem>>;
}

/**
 * Executive Board document from Prismic
 *
 * - **API ID**: `executive_board`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ExecutiveBoardDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ExecutiveBoardDocumentData>, "executive_board", Lang>;

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

type FundraiserDocumentDataSlicesSlice = RichTextSlice | ImageWithTextSlice | HeroSlice | FaqSlice | ProcessSlice | CategoryListSlice | PricingTierSlice | EventDetailsSlice

/**
 * Content for Fundraiser documents
 */
interface FundraiserDocumentData {
	/**
	 * Title field in *Fundraiser*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Excerpt field in *Fundraiser*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.excerpt
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	excerpt: prismic.RichTextField;
	
	/**
	 * Featured Image field in *Fundraiser*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.featured_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	featured_image: prismic.ImageField<never>;
	
	/**
	 * Custom Theme field in *Fundraiser*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.custom_theme
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	custom_theme: ContentRelationshipFieldWithData<[{"fields":["name","primary_color","primary_foreground_color","secondary_color","secondary_foreground_color","accent_color","accent_foreground_color","ring_color","background_pattern","primary_color_dark","primary_foreground_color_dark","secondary_color_dark","secondary_foreground_color_dark","accent_color_dark","accent_foreground_color_dark","flourish_font"],"id":"theme"}]>;
	
	/**
	 * Event Format field in *Fundraiser*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: in_person
	 * - **API ID Path**: fundraiser.event_format
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	event_format: prismic.SelectField<"in_person" | "virtual" | "hybrid", "filled">;
	
	/**
	 * Start field in *Fundraiser*
	 *
	 * - **Field Type**: Timestamp
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.start
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/timestamp
	 */
	start: prismic.TimestampField;
	
	/**
	 * End field in *Fundraiser*
	 *
	 * - **Field Type**: Timestamp
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.end
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/timestamp
	 */
	end: prismic.TimestampField;
	
	/**
	 * Venue Name field in *Fundraiser*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.venue_name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	venue_name: prismic.KeyTextField;
	
	/**
	 * Street Address field in *Fundraiser*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.street_address
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	street_address: prismic.KeyTextField;
	
	/**
	 * City field in *Fundraiser*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.city
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	city: prismic.KeyTextField;
	
	/**
	 * State field in *Fundraiser*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.state
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	state: prismic.KeyTextField;
	
	/**
	 * Zip Code field in *Fundraiser*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.zip_code
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	zip_code: prismic.KeyTextField;
	
	/**
	 * Virtual Link field in *Fundraiser*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.virtual_link
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	virtual_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Slice Zone field in *Fundraiser*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<FundraiserDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Fundraiser*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: fundraiser.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Fundraiser*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: fundraiser.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Fundraiser*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: fundraiser.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Allow Search Indexing field in *Fundraiser*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: fundraiser.allow_indexing
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	allow_indexing: prismic.BooleanField;
}

/**
 * Fundraiser document from Prismic
 *
 * - **API ID**: `fundraiser`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type FundraiserDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<FundraiserDocumentData>, "fundraiser", Lang>;

type HomepageDocumentDataSlicesSlice = EventsSlice | CarouselSlice | FaqSlice | ProcessSlice | TestimonialSlice | ImageWithTextSlice | FeaturesSlice | HeroSlice | RichTextSlice | DontationSlice

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

type PageDocumentDataSlicesSlice = EventsSlice | FormSlice | ContentIndexSlice | FeaturesSlice | FaqSlice | CarouselSlice | TestimonialSlice | ProcessSlice | ImageWithTextSlice | RichTextSlice | HeroSlice | OptOutSlice | DontationSlice | BoardIndexSlice

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
	parent: ContentRelationshipFieldWithData<[{"fields":["title",{"customtypes":[{"fields":["title","parent"],"id":"page"}],"id":"parent"}],"id":"page"}]>;
	
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

type PostDocumentDataSlicesSlice = TestimonialSlice | FaqSlice | ProcessSlice | RichTextSlice | ImageWithTextSlice | HeroSlice | DontationSlice

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

/**
 * Content for Theme documents
 */
interface ThemeDocumentData {
	/**
	 * Name field in *Theme*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Primary Color field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.primary_color
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	primary_color: prismic.ColorField;
	
	/**
	 * Primary Dark field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.primary_color_dark
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	primary_color_dark: prismic.ColorField;
	
	/**
	 * Primary Foreground Color field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.primary_foreground_color
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	primary_foreground_color: prismic.ColorField;
	
	/**
	 * Primary Foreground Dark field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.primary_foreground_color_dark
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	primary_foreground_color_dark: prismic.ColorField;
	
	/**
	 * Secondary Color field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.secondary_color
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	secondary_color: prismic.ColorField;
	
	/**
	 * Secondary Dark field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.secondary_color_dark
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	secondary_color_dark: prismic.ColorField;
	
	/**
	 * Secondary Foreground Color field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.secondary_foreground_color
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	secondary_foreground_color: prismic.ColorField;
	
	/**
	 * Secondary Foreground Dark field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.secondary_foreground_color_dark
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	secondary_foreground_color_dark: prismic.ColorField;
	
	/**
	 * Accent Color field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.accent_color
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	accent_color: prismic.ColorField;
	
	/**
	 * Accent Dark field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.accent_color_dark
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	accent_color_dark: prismic.ColorField;
	
	/**
	 * Accent Foreground Color field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.accent_foreground_color
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	accent_foreground_color: prismic.ColorField;
	
	/**
	 * Accent Foreground Dark field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.accent_foreground_color_dark
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	accent_foreground_color_dark: prismic.ColorField;
	
	/**
	 * Ring Override field in *Theme*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.ring_color
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	ring_color: prismic.ColorField;
	
	/**
	 * Background Pattern field in *Theme*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: theme.background_pattern
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	background_pattern: prismic.ImageField<never>;
	
	/**
	 * Flourish Font field in *Theme*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: playfair
	 * - **API ID Path**: theme.flourish_font
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	flourish_font: prismic.SelectField<"playfair" | "dancing_script" | "cormorant" | "great_vibes", "filled">;
}

/**
 * Theme document from Prismic
 *
 * - **API ID**: `theme`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ThemeDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ThemeDocumentData>, "theme", Lang>;

export type AllDocumentTypes = BoardMemberDocument | BoardPositionDocument | ExecutiveBoardDocument | FooterMultiColumnDocument | FundraiserDocument | HomepageDocument | LayoutDocument | PageDocument | PostDocument | SettingsDocument | ThemeDocument;

/**
 * Primary content in *BoardIndex → Default → Primary*
 */
export interface BoardIndexSliceDefaultPrimary {
	/**
	 * Number field in *BoardIndex → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: How many boards to display per page
	 * - **API ID Path**: board_index.default.primary.number
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	number: prismic.NumberField;
}

/**
 * Default variation for BoardIndex Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BoardIndexSliceDefault = prismic.SharedSliceVariation<"default", Simplify<BoardIndexSliceDefaultPrimary>, never>;

/**
 * Slice variation for *BoardIndex*
 */
type BoardIndexSliceVariation = BoardIndexSliceDefault

/**
 * BoardIndex Shared Slice
 *
 * - **API ID**: `board_index`
 * - **Description**: BoardIndex
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BoardIndexSlice = prismic.SharedSlice<"board_index", BoardIndexSliceVariation>;

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
 * Item in *CategoryList → Default → Primary → Categories*
 */
export interface CategoryListSliceDefaultPrimaryCategoriesItem {
	/**
	 * Category field in *CategoryList → Default → Primary → Categories*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: category_list.default.primary.categories[].category
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	category: prismic.KeyTextField;
}

/**
 * Primary content in *CategoryList → Default → Primary*
 */
export interface CategoryListSliceDefaultPrimary {
	/**
	 * Eyebrow field in *CategoryList → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: category_list.default.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * Categories field in *CategoryList → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: category_list.default.primary.categories[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	categories: prismic.GroupField<Simplify<CategoryListSliceDefaultPrimaryCategoriesItem>>;
}

/**
 * Default variation for CategoryList Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CategoryListSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CategoryListSliceDefaultPrimary>, never>;

/**
 * Slice variation for *CategoryList*
 */
type CategoryListSliceVariation = CategoryListSliceDefault

/**
 * CategoryList Shared Slice
 *
 * - **API ID**: `category_list`
 * - **Description**: CategoryList
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CategoryListSlice = prismic.SharedSlice<"category_list", CategoryListSliceVariation>;

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
	content_type: prismic.SelectField<"post" | "fundraiser", "filled">;
	
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
 * Primary content in *Donation → Default → Primary*
 */
export interface DontationSliceDefaultPrimary {
	/**
	 * Heading field in *Donation → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: dontation.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Description field in *Donation → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: dontation.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
}

/**
 * Default variation for Donation Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type DontationSliceDefault = prismic.SharedSliceVariation<"default", Simplify<DontationSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Donation*
 */
type DontationSliceVariation = DontationSliceDefault

/**
 * Donation Shared Slice
 *
 * - **API ID**: `dontation`
 * - **Description**: Dontation
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type DontationSlice = prismic.SharedSlice<"dontation", DontationSliceVariation>;

/**
 * Primary content in *EventDetails → Default → Primary*
 */
export interface EventDetailsSliceDefaultPrimary {
	/**
	 * Heading field in *EventDetails → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: event_details.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Contact Prompt field in *EventDetails → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: event_details.default.primary.contact_prompt
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	contact_prompt: prismic.RichTextField;
}

/**
 * Default variation for EventDetails Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type EventDetailsSliceDefault = prismic.SharedSliceVariation<"default", Simplify<EventDetailsSliceDefaultPrimary>, never>;

/**
 * Slice variation for *EventDetails*
 */
type EventDetailsSliceVariation = EventDetailsSliceDefault

/**
 * EventDetails Shared Slice
 *
 * - **API ID**: `event_details`
 * - **Description**: EventDetails
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type EventDetailsSlice = prismic.SharedSlice<"event_details", EventDetailsSliceVariation>;

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
 * Primary content in *Hero → EventHero → Primary*
 */
export interface HeroSliceEventHeroPrimary {
	/**
	 * Image field in *Hero → EventHero → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.eventHero.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Eyebrow field in *Hero → EventHero → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.eventHero.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * Heading field in *Hero → EventHero → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Benefit driven headline
	 * - **API ID Path**: hero.eventHero.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Button Link field in *Hero → EventHero → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: Enter link
	 * - **API ID Path**: hero.eventHero.primary.button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.Repeatable<prismic.LinkField<string, string, unknown, prismic.FieldState, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link">>;
	
	/**
	 * Logo Override field in *Hero → EventHero → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.eventHero.primary.logo_override
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo_override: prismic.ImageField<never>;
}

/**
 * EventHero variation for Hero Slice
 *
 * - **API ID**: `eventHero`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceEventHero = prismic.SharedSliceVariation<"eventHero", Simplify<HeroSliceEventHeroPrimary>, never>;

/**
 * Slice variation for *Hero*
 */
type HeroSliceVariation = HeroSliceDefault | HeroSliceWithImage | HeroSliceContentHeight | HeroSliceEventHero

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
 * Item in *PricingTier → Default → Primary → Tiers*
 */
export interface PricingTierSliceDefaultPrimaryTiersItem {
	/**
	 * Price field in *PricingTier → Default → Primary → Tiers*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pricing_tier.default.primary.tiers[].price
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	price: prismic.NumberField;
	
	/**
	 * Label field in *PricingTier → Default → Primary → Tiers*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pricing_tier.default.primary.tiers[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Description field in *PricingTier → Default → Primary → Tiers*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pricing_tier.default.primary.tiers[].description
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
	
	/**
	 * Icon field in *PricingTier → Default → Primary → Tiers*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pricing_tier.default.primary.tiers[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	icon: prismic.ImageField<never>;
	
	/**
	 * Featured field in *PricingTier → Default → Primary → Tiers*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: pricing_tier.default.primary.tiers[].featured
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	featured: prismic.BooleanField;
	
	/**
	 * Link field in *PricingTier → Default → Primary → Tiers*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pricing_tier.default.primary.tiers[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *PricingTier → Default → Primary*
 */
export interface PricingTierSliceDefaultPrimary {
	/**
	 * Tiers field in *PricingTier → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pricing_tier.default.primary.tiers[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	tiers: prismic.GroupField<Simplify<PricingTierSliceDefaultPrimaryTiersItem>>;
}

/**
 * Default variation for PricingTier Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PricingTierSliceDefault = prismic.SharedSliceVariation<"default", Simplify<PricingTierSliceDefaultPrimary>, never>;

/**
 * Slice variation for *PricingTier*
 */
type PricingTierSliceVariation = PricingTierSliceDefault

/**
 * PricingTier Shared Slice
 *
 * - **API ID**: `pricing_tier`
 * - **Description**: PricingTier
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PricingTierSlice = prismic.SharedSlice<"pricing_tier", PricingTierSliceVariation>;

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
			BoardMemberDocument,
			BoardMemberDocumentData,
			BoardPositionDocument,
			BoardPositionDocumentData,
			ExecutiveBoardDocument,
			ExecutiveBoardDocumentData,
			ExecutiveBoardDocumentDataMembersItem,
			FooterMultiColumnDocument,
			FooterMultiColumnDocumentData,
			FooterMultiColumnDocumentDataSlicesSlice,
			FooterMultiColumnDocumentDataSlices1Slice,
			FooterMultiColumnDocumentDataSlices2Slice,
			FundraiserDocument,
			FundraiserDocumentData,
			FundraiserDocumentDataSlicesSlice,
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
			ThemeDocument,
			ThemeDocumentData,
			AllDocumentTypes,
			BoardIndexSlice,
			BoardIndexSliceDefaultPrimary,
			BoardIndexSliceVariation,
			BoardIndexSliceDefault,
			CarouselSlice,
			CarouselSliceDefaultPrimary,
			CarouselSliceDefaultItem,
			CarouselSliceWithDetailsPrimaryItemsItem,
			CarouselSliceWithDetailsPrimary,
			CarouselSliceVariation,
			CarouselSliceDefault,
			CarouselSliceWithDetails,
			CategoryListSlice,
			CategoryListSliceDefaultPrimaryCategoriesItem,
			CategoryListSliceDefaultPrimary,
			CategoryListSliceVariation,
			CategoryListSliceDefault,
			ContentIndexSlice,
			ContentIndexSliceDefaultPrimary,
			ContentIndexSliceVariation,
			ContentIndexSliceDefault,
			DontationSlice,
			DontationSliceDefaultPrimary,
			DontationSliceVariation,
			DontationSliceDefault,
			EventDetailsSlice,
			EventDetailsSliceDefaultPrimary,
			EventDetailsSliceVariation,
			EventDetailsSliceDefault,
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
			HeroSliceEventHeroPrimary,
			HeroSliceVariation,
			HeroSliceDefault,
			HeroSliceWithImage,
			HeroSliceContentHeight,
			HeroSliceEventHero,
			ImageWithTextSlice,
			ImageWithTextSliceDefaultPrimary,
			ImageWithTextSliceRightImagePrimary,
			ImageWithTextSliceVariation,
			ImageWithTextSliceDefault,
			ImageWithTextSliceRightImage,
			OptOutSlice,
			OptOutSliceVariation,
			OptOutSliceDefault,
			PricingTierSlice,
			PricingTierSliceDefaultPrimaryTiersItem,
			PricingTierSliceDefaultPrimary,
			PricingTierSliceVariation,
			PricingTierSliceDefault,
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