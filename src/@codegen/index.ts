import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ClosingPrice = {
  __typename?: 'ClosingPrice';
  date: Scalars['String'];
  price: Scalars['Float'];
  dateCreated: Scalars['String'];
};

export type Company = {
  __typename?: 'Company';
  id: Scalars['String'];
  name: Scalars['String'];
  tickerSymbol: Scalars['String'];
  exchangeSymbol: Scalars['String'];
  uniqueSymbol: Scalars['String'];
  dateGenerated: Scalars['String'];
  securityName: Scalars['String'];
  exchangeCountryIso: Scalars['String'];
  listingCountryIso: Scalars['String'];
  canonicalUrl: Scalars['String'];
  uniqueSymbolSlug: Scalars['String'];
  score?: Maybe<SnowflakeScore>;
  prices?: Maybe<Array<Maybe<ClosingPrice>>>;
};


export type CompanyPricesArgs = {
  fromDate: Scalars['String'];
  toDate: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getCompany?: Maybe<Company>;
  getCompanies?: Maybe<Array<Maybe<Company>>>;
};


export type QueryGetCompanyArgs = {
  id: Scalars['String'];
};


export type QueryGetCompaniesArgs = {
  limit: Scalars['Int'];
  afterCompanyID?: Maybe<Scalars['String']>;
};

export type SnowflakeScore = {
  __typename?: 'SnowflakeScore';
  dateGenerated: Scalars['String'];
  sentence: Scalars['String'];
  dividend: Scalars['Int'];
  future: Scalars['Int'];
  health: Scalars['Int'];
  management: Scalars['Int'];
  past: Scalars['Int'];
  value: Scalars['Int'];
  misc: Scalars['Int'];
  total: Scalars['Int'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ClosingPrice: ResolverTypeWrapper<ClosingPrice>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Company: ResolverTypeWrapper<Company>;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  SnowflakeScore: ResolverTypeWrapper<SnowflakeScore>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ClosingPrice: ClosingPrice;
  String: Scalars['String'];
  Float: Scalars['Float'];
  Company: Company;
  Query: {};
  Int: Scalars['Int'];
  SnowflakeScore: SnowflakeScore;
  Boolean: Scalars['Boolean'];
};

export type ClosingPriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClosingPrice'] = ResolversParentTypes['ClosingPrice']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  dateCreated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tickerSymbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exchangeSymbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uniqueSymbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dateGenerated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  securityName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exchangeCountryIso?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  listingCountryIso?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  canonicalUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uniqueSymbolSlug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['SnowflakeScore']>, ParentType, ContextType>;
  prices?: Resolver<Maybe<Array<Maybe<ResolversTypes['ClosingPrice']>>>, ParentType, ContextType, RequireFields<CompanyPricesArgs, 'fromDate' | 'toDate'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getCompany?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType, RequireFields<QueryGetCompanyArgs, 'id'>>;
  getCompanies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Company']>>>, ParentType, ContextType, RequireFields<QueryGetCompaniesArgs, 'limit'>>;
};

export type SnowflakeScoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['SnowflakeScore'] = ResolversParentTypes['SnowflakeScore']> = {
  dateGenerated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sentence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dividend?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  future?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  health?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  management?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  past?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  misc?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ClosingPrice?: ClosingPriceResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SnowflakeScore?: SnowflakeScoreResolvers<ContextType>;
};

