import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import PolarisText from "@/components/PolarisText";

import {
  fetchMovies,
  fetchSeries,
  TMDB_CONFIG,
} from "@/services/api";

import { updateSearchCount } from "@/services/appwrite";


/* ============================================================
   TYPES
============================================================ */

type MediaItem = {
  id: number;

  title?: string;
  name?: string;

  poster_path?: string | null;
  backdrop_path?: string | null;

  release_date?: string;
  first_air_date?: string;

  vote_average?: number;
  popularity?: number;
};


type MediaType =
  | "all"
  | "movie"
  | "tv";


type SortType =
  | "popular"
  | "rating"
  | "newest";


type Category = {
  id: number;
  name: string;
};


/* ============================================================
   CONSTANTS
============================================================ */

const TMDB_IMAGE =
  "https://image.tmdb.org/t/p/";


const CATEGORIES: Category[] = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 878,
    name: "Sci-Fi",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 16,
    name: "Animation",
  },
];


const DEFAULT_RECENT_SEARCHES = [
  "Dune",
  "Interstellar",
  "Oppenheimer",
  "Spider-Man",
];


/* ============================================================
   CATEGORY FETCH
============================================================ */

async function fetchCategoryResults(
  genreId: number,
  mediaType: MediaType
): Promise<MediaItem[]> {

  const endpoint =
    mediaType === "tv"
      ? `${TMDB_CONFIG.BASE_URL}/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=1`
      : `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`;

  const response = await fetch(
    endpoint,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch category results: ${response.status}`
    );
  }

  const data =
    await response.json();

  return Array.isArray(data.results)
    ? data.results
    : [];
}


/* ============================================================
   SEARCH
============================================================ */

async function searchMedia(
  query: string,
  mediaType: MediaType
): Promise<MediaItem[]> {

  const trimmed =
    query.trim();

  if (!trimmed) {
    return [];
  }


  if (mediaType === "movie") {
    const results =
      await fetchMovies({
        query: trimmed,
      });

    return Array.isArray(results)
      ? results
      : [];
  }


  if (mediaType === "tv") {
    const results =
      await fetchSeries({
        query: trimmed,
      });

    return Array.isArray(results)
      ? results
      : [];
  }


  /*
   * ALL
   * Search movies + TV simultaneously.
   */

  const [
    movieResults,
    tvResults,
  ] = await Promise.all([
    fetchMovies({
      query: trimmed,
    }),

    fetchSeries({
      query: trimmed,
    }),
  ]);


  const movies =
    Array.isArray(movieResults)
      ? movieResults
      : [];

  const series =
    Array.isArray(tvResults)
      ? tvResults
      : [];


  return [
    ...movies,
    ...series,
  ];
}


/* ============================================================
   TRENDING / POPULAR
============================================================ */

async function loadTrending():
  Promise<MediaItem[]> {

  const results =
    await fetchMovies({
      query: "",
    });

  return Array.isArray(results)
    ? results.slice(0, 10)
    : [];
}


/* ============================================================
   SEARCH SCREEN
============================================================ */

export default function Search() {

  const router =
    useRouter();


  /* ==========================================================
     SEARCH STATE
  ========================================================== */

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const [
    results,
    setResults,
  ] = useState<MediaItem[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  /* ==========================================================
     FILTER STATE
  ========================================================== */

  const [
    mediaType,
    setMediaType,
  ] = useState<MediaType>("all");


  const [
    sortType,
    setSortType,
  ] = useState<SortType>(
    "popular"
  );


  const [
    filterVisible,
    setFilterVisible,
  ] = useState(false);


  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<Category | null>(
    null
  );


  /* ==========================================================
     RECENT SEARCHES
  ========================================================== */

  const [
    recentSearches,
    setRecentSearches,
  ] = useState<string[]>(
    DEFAULT_RECENT_SEARCHES
  );


  /* ==========================================================
     TRENDING
  ========================================================== */

  const [
    trendingMovies,
    setTrendingMovies,
  ] = useState<MediaItem[]>([]);


  const [
    trendingLoading,
    setTrendingLoading,
  ] = useState(true);


  /* ==========================================================
     SAFE QUERY
  ========================================================== */

  const safeQuery =
    typeof searchQuery === "string"
      ? searchQuery
      : "";


  const trimmedQuery =
    safeQuery.trim();


  /* ==========================================================
     SORT RESULTS
  ========================================================== */

  const sortedResults =
    useMemo(() => {

      const items = Array.isArray(results)
        ? [...results]
        : [];


      if (sortType === "rating") {
        return items.sort(
          (a, b) =>
            (b.vote_average ?? 0) -
            (a.vote_average ?? 0)
        );
      }


      if (sortType === "newest") {
        return items.sort(
          (a, b) => {

            const dateA =
              a.release_date ||
              a.first_air_date ||
              "";

            const dateB =
              b.release_date ||
              b.first_air_date ||
              "";

            return dateB.localeCompare(
              dateA
            );
          }
        );
      }


      return items.sort(
        (a, b) =>
          (b.popularity ?? 0) -
          (a.popularity ?? 0)
      );

    }, [results, sortType]);


  /* ==========================================================
     INITIAL TRENDING
  ========================================================== */

  useEffect(() => {

    loadTrendingContent();

  }, []);


  async function loadTrendingContent() {

    try {

      setTrendingLoading(true);

      const data =
        await loadTrending();

      setTrendingMovies(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "TRENDING ERROR:",
        error
      );

    } finally {

      setTrendingLoading(false);

    }
  }


  /* ==========================================================
     SEARCH / CATEGORY EFFECT
  ========================================================== */

  useEffect(() => {

    const timeout =
      setTimeout(() => {

        if (
          selectedCategory
        ) {

          loadCategory(
            selectedCategory
          );

          return;
        }


        if (
          trimmedQuery
        ) {

          performSearch(
            trimmedQuery
          );

          return;
        }


        setResults([]);
        setError(null);

      }, 450);


    return () =>
      clearTimeout(timeout);

  }, [
    trimmedQuery,
    mediaType,
    selectedCategory,
  ]);


  /* ==========================================================
     SEARCH
  ========================================================== */

  async function performSearch(
    query: string
  ) {

    try {

      setLoading(true);
      setError(null);


      const data =
        await searchMedia(
          query,
          mediaType
        );


      const safeResults =
        Array.isArray(data)
          ? data
          : [];


      setResults(
        safeResults
      );


      if (
        safeResults.length > 0
      ) {

        try {

          await updateSearchCount(
            query,
            safeResults[0]
          );

        } catch (analyticsError) {

          console.log(
            "SEARCH ANALYTICS ERROR:",
            analyticsError
          );

        }

      }

    } catch (error) {

      console.error(
        "SEARCH ERROR:",
        error
      );

      setError(
        "Something went wrong while searching."
      );

      setResults([]);

    } finally {

      setLoading(false);

    }
  }


  /* ==========================================================
     CATEGORY
  ========================================================== */

  async function loadCategory(
    category: Category
  ) {

    try {

      setLoading(true);
      setError(null);


      const data =
        await fetchCategoryResults(
          category.id,
          mediaType
        );


      setResults(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "CATEGORY ERROR:",
        error
      );

      setError(
        "Unable to load this category."
      );

      setResults([]);

    } finally {

      setLoading(false);

    }
  }


  function handleCategory(
    category: Category
  ) {

    setSelectedCategory(
      category
    );

    setSearchQuery("");

  }


  /* ==========================================================
     SEARCH INPUT
  ========================================================== */

  function handleSearch(
    text: string
  ) {

    setSelectedCategory(null);

    setSearchQuery(
      text ?? ""
    );

  }


  /* ==========================================================
     CLEAR SEARCH
  ========================================================== */

  function clearSearch() {

    setSearchQuery("");

    setSelectedCategory(null);

    setResults([]);

    setError(null);

  }


  /* ==========================================================
     RECENT SEARCH
  ========================================================== */

  function handleRecentSearch(
    query: string
  ) {

    setSelectedCategory(null);

    setSearchQuery(
      query
    );


    setRecentSearches(
      current => [
        query,

        ...current.filter(
          item =>
            item.toLowerCase() !==
            query.toLowerCase()
        ),

      ].slice(0, 6)
    );

  }


  function clearRecentSearches() {

    setRecentSearches([]);

  }


  /* ==========================================================
     APPLY FILTER
  ========================================================== */

  function applyFilter() {

    setFilterVisible(false);

  }


  /* ==========================================================
     MOVIE DETAILS
  ========================================================== */

  function openMovie(
    movie: MediaItem
  ) {

    router.push({
      pathname: "/movies/[id]",

      params: {
        id:
          movie.id.toString(),

        mediaType:
          movie.name
            ? "tv"
            : "movie",
      },
    });

  }


  /* ==========================================================
     RESULT TITLE
  ========================================================== */

  function getTitle(
    movie: MediaItem
  ) {

    return (
      movie.title ||
      movie.name ||
      "Untitled"
    );

  }


  /* ==========================================================
     RESULT YEAR
  ========================================================== */

  function getYear(
    movie: MediaItem
  ) {

    const date =
      movie.release_date ||
      movie.first_air_date ||
      "";

    return date
      ? date.slice(0, 4)
      : "";

  }


  /* ==========================================================
     RESULT CARD
  ========================================================== */

  function renderMovie({
    item,
  }: {
    item: MediaItem;
  }) {

    return (

      <Pressable
        onPress={() =>
          openMovie(item)
        }
        style={
          styles.movieCard
        }
      >

        {item.poster_path ? (

          <Image
            source={{
              uri:
                `${TMDB_IMAGE}w342` +
                item.poster_path,
            }}
            style={
              styles.moviePoster
            }
          />

        ) : (

          <View
            style={
              styles.posterPlaceholder
            }
          >

            <Ionicons
              name="film-outline"
              size={26}
              color="#56616E"
            />

          </View>

        )}


        <PolarisText
          weight="semiBold"
          numberOfLines={2}
          style={
            styles.movieTitle
          }
        >
          {getTitle(item)}
        </PolarisText>


        {getYear(item) && (

          <PolarisText
            style={
              styles.movieYear
            }
          >
            {getYear(item)}
          </PolarisText>

        )}

      </Pressable>

    );
  }


  /* ==========================================================
     TRENDING CARD
  ========================================================== */

  function renderTrending(
    movie: MediaItem,
    index: number
  ) {

    return (

      <Pressable
        key={`${movie.id}-${index}`}
        onPress={() =>
          openMovie(movie)
        }
        style={
          styles.trendingCard
        }
      >

        {movie.poster_path ? (

          <Image
            source={{
              uri:
                `${TMDB_IMAGE}w342` +
                movie.poster_path,
            }}
            style={
              styles.trendingPoster
            }
          />

        ) : (

          <View
            style={
              styles.trendingPlaceholder
            }
          />

        )}


        <PolarisText
          weight="semiBold"
          numberOfLines={2}
          style={
            styles.trendingTitle
          }
        >
          {getTitle(movie)}
        </PolarisText>


        {getYear(movie) && (

          <PolarisText
            style={
              styles.trendingYear
            }
          >
            {getYear(movie)}
          </PolarisText>

        )}

      </Pressable>

    );
  }


  /* ==========================================================
     FILTER LABELS
  ========================================================== */

  const mediaTypeLabel =
    mediaType === "all"
      ? "All"
      : mediaType === "movie"
        ? "Movies"
        : "TV Shows";


  const sortLabel =
    sortType === "popular"
      ? "Popular"
      : sortType === "rating"
        ? "Rating"
        : "Newest";


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <View
      style={
        styles.container
      }
    >

      <FlatList
        data={
          trimmedQuery ||
          selectedCategory
            ? sortedResults
            : []
        }

        keyExtractor={item =>
          `${item.id}-${item.name ? "tv" : "movie"}`
        }

        renderItem={
          renderMovie
        }

        numColumns={3}

        columnWrapperStyle={
          styles.resultsRow
        }

        showsVerticalScrollIndicator={
          false
        }

        keyboardShouldPersistTaps="handled"

        contentContainerStyle={
          styles.content
        }


        /* ======================================================
           HEADER
        ====================================================== */

        ListHeaderComponent={

          <View>

            {/* HEADER */}

            <View
              style={
                styles.header
              }
            >

              <PolarisText
                style={
                  styles.headerTitle
                }
              >
                Search
              </PolarisText>


              <PolarisText
                style={
                  styles.headerSubtitle
                }
              >
                Find your next story.
              </PolarisText>

            </View>


            {/* SEARCH BAR */}

            <View
              style={
                styles.searchContainer
              }
            >

              <Ionicons
                name="search-outline"
                size={24}
                color="#F4F7FA"
              />


              <TextInput
                value={
                  safeQuery
                }

                onChangeText={
                  handleSearch
                }

                placeholder={
                  "Search for movies, shows, people..."
                }

                placeholderTextColor={
                  "#A5ADB7"
                }

                style={
                  styles.searchInput
                }

                autoCorrect={false}

                autoCapitalize="none"

                returnKeyType="search"
              />


              {safeQuery.length > 0 ? (

                <Pressable
                  onPress={
                    clearSearch
                  }
                  style={
                    styles.clearButton
                  }
                >

                  <Ionicons
                    name="close"
                    size={20}
                    color="#DCE2E8"
                  />

                </Pressable>

              ) : (

                <Pressable
                  onPress={() =>
                    setFilterVisible(
                      true
                    )
                  }
                  style={
                    styles.filterButton
                  }
                >

                  <Ionicons
                    name="options-outline"
                    size={23}
                    color="#F4F7FA"
                  />

                </Pressable>

              )}

            </View>


            {/* ACTIVE FILTER */}

            {(mediaType !== "all" ||
              sortType !== "popular") && (

              <View
                style={
                  styles.activeFilterRow
                }
              >

                <View
                  style={
                    styles.activeFilterPill
                  }
                >

                  <PolarisText
                    weight="medium"
                    style={
                      styles.activeFilterText
                    }
                  >
                    {mediaTypeLabel}
                  </PolarisText>

                </View>


                <View
                  style={
                    styles.activeFilterPill
                  }
                >

                  <PolarisText
                    weight="medium"
                    style={
                      styles.activeFilterText
                    }
                  >
                    {sortLabel}
                  </PolarisText>

                </View>


                <Pressable
                  onPress={() => {
                    setMediaType("all");
                    setSortType("popular");
                  }}
                >

                  <PolarisText
                    style={
                      styles.resetFilterText
                    }
                  >
                    Reset
                  </PolarisText>

                </Pressable>

              </View>

            )}


            {/* ==================================================
                SEARCH RESULTS HEADER
            ================================================== */}

            {(trimmedQuery ||
              selectedCategory) && (

              <View
                style={
                  styles.searchMode
                }
              >

                <View
                  style={
                    styles.sectionHeader
                  }
                >

                  <PolarisText
                    weight="semiBold"
                    style={
                      styles.sectionTitle
                    }
                  >
                    {selectedCategory
                      ? selectedCategory.name
                      : "Search Results"}
                  </PolarisText>


                  {!loading &&
                    sortedResults.length >
                      0 && (

                    <PolarisText
                      style={
                        styles.resultCount
                      }
                    >
                      {sortedResults.length}
                    </PolarisText>

                  )}

                </View>


                {loading && (

                  <View
                    style={
                      styles.loading
                    }
                  >

                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />

                    <PolarisText
                      style={
                        styles.loadingText
                      }
                    >
                      Searching...
                    </PolarisText>

                  </View>

                )}


                {error && !loading && (

                  <View
                    style={
                      styles.emptyState
                    }
                  >

                    <Ionicons
                      name="alert-circle-outline"
                      size={32}
                      color="#68737F"
                    />

                    <PolarisText
                      style={
                        styles.emptyTitle
                      }
                    >
                      {error}
                    </PolarisText>

                  </View>

                )}


                {!loading &&
                  !error &&
                  sortedResults.length ===
                    0 && (

                  <View
                    style={
                      styles.emptyState
                    }
                  >

                    <Ionicons
                      name="search-outline"
                      size={34}
                      color="#56616E"
                    />

                    <PolarisText
                      weight="semiBold"
                      style={
                        styles.emptyTitle
                      }
                    >
                      No stories found
                    </PolarisText>


                    <PolarisText
                      style={
                        styles.emptySubtitle
                      }
                    >
                      Try another movie
                      or show title.
                    </PolarisText>

                  </View>

                )}

              </View>

            )}


            {/* ==================================================
                DEFAULT SEARCH CONTENT
            ================================================== */}

            {!trimmedQuery &&
              !selectedCategory && (

              <View>

                {/* ==================================================
                    RECENT SEARCHES
                ================================================== */}

                {recentSearches.length >
                  0 && (

                  <View
                    style={
                      styles.section
                    }
                  >

                    <View
                      style={
                        styles.sectionHeader
                      }
                    >

                      <PolarisText
                        weight="semiBold"
                        style={
                          styles.sectionTitle
                        }
                      >
                        Recent Searches
                      </PolarisText>


                      <Pressable
                        onPress={
                          clearRecentSearches
                        }
                      >

                        <PolarisText
                          style={
                            styles.seeAll
                          }
                        >
                          Clear All
                        </PolarisText>

                      </Pressable>

                    </View>


                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={
                        false
                      }
                      contentContainerStyle={
                        styles.chipList
                      }
                    >

                      {recentSearches.map(
                        search => (

                          <Pressable
                            key={
                              search
                            }
                            onPress={() =>
                              handleRecentSearch(
                                search
                              )
                            }
                            style={
                              styles.recentChip
                            }
                          >

                            <Ionicons
                              name="time-outline"
                              size={16}
                              color="#D8DEE6"
                            />


                            <PolarisText
                              weight="medium"
                              style={
                                styles.recentText
                              }
                            >
                              {search}
                            </PolarisText>

                          </Pressable>

                        )
                      )}

                    </ScrollView>

                  </View>

                )}


                {/* ==================================================
                    EXPLORE BY CATEGORY
                ================================================== */}

                <View
                  style={
                    styles.section
                  }
                >

                  <View
                    style={
                      styles.sectionHeader
                    }
                  >

                    <PolarisText
                      weight="semiBold"
                      style={
                        styles.sectionTitle
                      }
                    >
                      Explore by Category
                    </PolarisText>


                    <Pressable>

                      <View
                        style={
                          styles.seeAllRow
                        }
                      >

                        <PolarisText
                          style={
                            styles.seeAll
                          }
                        >
                          See All
                        </PolarisText>

                        <Ionicons
                          name="chevron-forward"
                          size={15}
                          color="#AEB7C2"
                        />

                      </View>

                    </Pressable>

                  </View>


                  <View
                    style={
                      styles.categoryGrid
                    }
                  >

                    {CATEGORIES.map(
                      category => (

                        <Pressable
                          key={
                            category.id
                          }
                          onPress={() =>
                            handleCategory(
                              category
                            )
                          }
                          style={
                            styles.categoryChip
                          }
                        >

                          <PolarisText
                            weight="medium"
                            style={
                              styles.categoryText
                            }
                          >
                            {category.name}
                          </PolarisText>

                        </Pressable>

                      )
                    )}

                  </View>

                </View>


                {/* ==================================================
                    TRENDING
                ================================================== */}

                <View
                  style={
                    styles.section
                  }
                >

                  <View
                    style={
                      styles.sectionHeader
                    }
                  >

                    <PolarisText
                      weight="semiBold"
                      style={
                        styles.sectionTitle
                      }
                    >
                      Trending Right Now
                    </PolarisText>


                    <Pressable>

                      <View
                        style={
                          styles.seeAllRow
                        }
                      >

                        <PolarisText
                          style={
                            styles.seeAll
                          }
                        >
                          See All
                        </PolarisText>


                        <Ionicons
                          name="chevron-forward"
                          size={15}
                          color="#AEB7C2"
                        />

                      </View>

                    </Pressable>

                  </View>


                  {trendingLoading ? (

                    <View
                      style={
                        styles.trendingLoading
                      }
                    >

                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                      />

                    </View>

                  ) : (

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={
                        false
                      }
                      contentContainerStyle={
                        styles.trendingList
                      }
                    >

                      {trendingMovies.map(
                        renderTrending
                      )}

                    </ScrollView>

                  )}

                </View>

              </View>

            )}

          </View>
        }


        ListEmptyComponent={
          trimmedQuery ||
          selectedCategory ? null : (

            <View
              style={
                styles.hiddenEmpty
              }
            />

          )
        }

      />


      {/* ========================================================
          FILTER MODAL
      ======================================================== */}

      <Modal
        visible={
          filterVisible
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setFilterVisible(false)
        }
      >

        <View
          style={
            styles.modalContainer
          }
        >

          <Pressable
            style={
              styles.modalBackdrop
            }
            onPress={() =>
              setFilterVisible(false)
            }
          />


          <View
            style={
              styles.filterSheet
            }
          >

            {/* HANDLE */}

            <View
              style={
                styles.sheetHandle
              }
            />


            {/* HEADER */}

            <View
              style={
                styles.filterHeader
              }
            >

              <PolarisText
                weight="semiBold"
                style={
                  styles.filterTitle
                }
              >
                Filter
              </PolarisText>


              <Pressable
                onPress={() =>
                  setFilterVisible(false)
                }
              >

                <Ionicons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />

              </Pressable>

            </View>


            {/* MEDIA TYPE */}

            <PolarisText
              weight="semiBold"
              style={
                styles.filterSectionTitle
              }
            >
              Media Type
            </PolarisText>


            <View
              style={
                styles.filterOptions
              }
            >

              <FilterOption
                label="All"
                active={
                  mediaType ===
                  "all"
                }
                onPress={() =>
                  setMediaType("all")
                }
              />


              <FilterOption
                label="Movies"
                active={
                  mediaType ===
                  "movie"
                }
                onPress={() =>
                  setMediaType(
                    "movie"
                  )
                }
              />


              <FilterOption
                label="TV Shows"
                active={
                  mediaType ===
                  "tv"
                }
                onPress={() =>
                  setMediaType("tv")
                }
              />

            </View>


            {/* SORT */}

            <PolarisText
              weight="semiBold"
              style={
                styles.filterSectionTitle
              }
            >
              Sort By
            </PolarisText>


            <View
              style={
                styles.filterOptions
              }
            >

              <FilterOption
                label="Popular"
                active={
                  sortType ===
                  "popular"
                }
                onPress={() =>
                  setSortType(
                    "popular"
                  )
                }
              />


              <FilterOption
                label="Rating"
                active={
                  sortType ===
                  "rating"
                }
                onPress={() =>
                  setSortType(
                    "rating"
                  )
                }
              />


              <FilterOption
                label="Newest"
                active={
                  sortType ===
                  "newest"
                }
                onPress={() =>
                  setSortType(
                    "newest"
                  )
                }
              />

            </View>


            {/* APPLY */}

            <Pressable
              onPress={
                applyFilter
              }
              style={
                styles.applyButton
              }
            >

              <PolarisText
                weight="semiBold"
                style={
                  styles.applyButtonText
                }
              >
                Apply
              </PolarisText>

            </Pressable>

          </View>

        </View>

      </Modal>

    </View>
  );
}


/* ============================================================
   FILTER OPTION
============================================================ */

function FilterOption({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {

  return (

    <Pressable
      onPress={onPress}
      style={[
        styles.filterOption,
        active &&
          styles.filterOptionActive,
      ]}
    >

      <PolarisText
        weight={
          active
            ? "semiBold"
            : "medium"
        }
        style={[
          styles.filterOptionText,
          active &&
            styles.filterOptionTextActive,
        ]}
      >
        {label}
      </PolarisText>

    </Pressable>

  );
}


/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0B0C0F",
  },


  content: {
    paddingTop: 58,
    paddingHorizontal: 22,
    paddingBottom: 120,
  },


  /* ==========================================================
     HEADER
  ========================================================== */

  header: {
    marginBottom: 24,
    paddingHorizontal: 2,
  },


  headerTitle: {
    color: "#F4F7FA",
    fontSize: 46,
    lineHeight: 54,
    letterSpacing: -1.2,
  },


  headerSubtitle: {
    color: "#9FA9B4",
    fontSize: 17,
    lineHeight: 25,
    letterSpacing: 1.4,
    marginTop: 2,
  },


  /* ==========================================================
     SEARCH
  ========================================================== */

  searchContainer: {
    height: 62,
    borderRadius: 31,

    flexDirection: "row",
    alignItems: "center",

    paddingLeft: 19,
    paddingRight: 8,

    backgroundColor:
      "rgba(255,255,255,0.055)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.22)",
  },


  searchInput: {
    flex: 1,

    color: "#F4F7FA",

    fontFamily: "Sen",

    fontSize: 15,

    marginLeft: 13,

    paddingVertical: 0,
  },


  filterButton: {
    width: 50,
    height: 52,

    alignItems: "center",
    justifyContent: "center",

    borderLeftWidth: 1,

    borderLeftColor:
      "rgba(255,255,255,0.14)",
  },


  clearButton: {
    width: 46,
    height: 46,

    alignItems: "center",
    justifyContent: "center",
  },


  /* ==========================================================
     ACTIVE FILTERS
  ========================================================== */

  activeFilterRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 7,

    marginTop: 10,
  },


  activeFilterPill: {
    height: 28,

    paddingHorizontal: 11,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.07)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.14)",
  },


  activeFilterText: {
    color: "#D8DEE6",
    fontSize: 11,
  },


  resetFilterText: {
    color: "#8FAED0",
    fontSize: 11,

    marginLeft: 3,
  },


  /* ==========================================================
     SECTIONS
  ========================================================== */

  section: {
    marginTop: 30,
  },


  searchMode: {
    marginTop: 28,
  },


  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,
  },


  sectionTitle: {
    color: "#F4F7FA",

    fontSize: 18,

    lineHeight: 24,
  },


  seeAll: {
    color: "#AEB7C2",

    fontSize: 13,
  },


  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 2,
  },


  resultCount: {
    color: "#68737F",

    fontSize: 12,
  },


  /* ==========================================================
     RECENT SEARCHES
  ========================================================== */

  chipList: {
    gap: 8,
    paddingRight: 20,
  },


  recentChip: {
    height: 43,

    paddingHorizontal: 15,

    borderRadius: 22,

    flexDirection: "row",
    alignItems: "center",

    gap: 8,

    backgroundColor:
      "rgba(255,255,255,0.045)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.16)",
  },


  recentText: {
    color: "#D9DEE5",

    fontSize: 13,
  },


  /* ==========================================================
     CATEGORIES
  ========================================================== */

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 8,
  },


  categoryChip: {
    height: 43,

    paddingHorizontal: 17,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.045)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.16)",
  },


  categoryText: {
    color: "#D9DEE5",

    fontSize: 13,
  },


  /* ==========================================================
     TRENDING
  ========================================================== */

  trendingList: {
    gap: 14,

    paddingRight: 20,
  },


  trendingCard: {
    width: 124,
  },


  trendingPoster: {
    width: 124,
    height: 184,

    borderRadius: 13,

    backgroundColor: "#151A20",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.14)",
  },


  trendingPlaceholder: {
    width: 124,
    height: 184,

    borderRadius: 13,

    backgroundColor: "#151A20",
  },


  trendingTitle: {
    color: "#F4F7FA",

    fontSize: 13,

    lineHeight: 17,

    marginTop: 8,
  },


  trendingYear: {
    color: "#7E8997",

    fontSize: 12,

    marginTop: 3,
  },


  trendingLoading: {
    height: 220,

    alignItems: "center",
    justifyContent: "center",
  },


  /* ==========================================================
     RESULTS
  ========================================================== */

  resultsRow: {
    justifyContent: "space-between",

    marginTop: 16,
  },


  movieCard: {
    width: "31.5%",
  },


  moviePoster: {
    width: "100%",

    aspectRatio: 0.67,

    borderRadius: 12,

    backgroundColor: "#151A20",
  },


  posterPlaceholder: {
    width: "100%",

    aspectRatio: 0.67,

    borderRadius: 12,

    backgroundColor: "#151A20",

    alignItems: "center",
    justifyContent: "center",
  },


  movieTitle: {
    color: "#F4F7FA",

    fontSize: 13,

    lineHeight: 17,

    marginTop: 8,
  },


  movieYear: {
    color: "#7E8997",

    fontSize: 11,

    marginTop: 3,
  },


  /* ==========================================================
     LOADING
  ========================================================== */

  loading: {
    height: 200,

    alignItems: "center",
    justifyContent: "center",

    gap: 10,
  },


  loadingText: {
    color: "#7E8997",

    fontSize: 13,
  },


  /* ==========================================================
     EMPTY
  ========================================================== */

  emptyState: {
    height: 240,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },


  emptyTitle: {
    color: "#C8CED6",

    fontSize: 15,

    marginTop: 12,

    textAlign: "center",
  },


  emptySubtitle: {
    color: "#68737F",

    fontSize: 13,

    marginTop: 5,

    textAlign: "center",
  },


  hiddenEmpty: {
    height: 1,
  },


  /* ==========================================================
     FILTER MODAL
  ========================================================== */

  modalContainer: {
    flex: 1,

    justifyContent: "flex-end",
  },


  modalBackdrop: {
    ...StyleSheet.absoluteFill,

    backgroundColor:
      "rgba(0,0,0,0.65)",
  },


  filterSheet: {
    backgroundColor: "#11151B",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 34,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.10)",
  },


  sheetHandle: {
    width: 42,
    height: 4,

    borderRadius: 2,

    backgroundColor:
      "rgba(255,255,255,0.25)",

    alignSelf: "center",

    marginBottom: 20,
  },


  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 26,
  },


  filterTitle: {
    color: "#FFFFFF",

    fontSize: 22,
  },


  filterSectionTitle: {
    color: "#DDE3EA",

    fontSize: 14,

    marginBottom: 10,
  },


  filterOptions: {
    flexDirection: "row",

    gap: 8,

    marginBottom: 24,
  },


  filterOption: {
    height: 42,

    paddingHorizontal: 17,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.045)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.13)",
  },


  filterOptionActive: {
    backgroundColor:
      "rgba(220,235,255,0.13)",

    borderColor:
      "rgba(220,235,255,0.38)",
  },


  filterOptionText: {
    color: "#929DA9",

    fontSize: 13,
  },


  filterOptionTextActive: {
    color: "#F4F7FA",
  },


  applyButton: {
    height: 52,

    borderRadius: 26,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#DCEBFF",

    marginTop: 4,
  },


  applyButtonText: {
    color: "#06090E",

    fontSize: 15,
  },

});