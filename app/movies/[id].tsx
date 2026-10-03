import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import PolarisText from "@/components/PolarisText";
import { UserContext } from "@/app/_layout";

import {
  fetchMediaDetailsFull,
  fetchSimilarMedia,
  getOfficialTrailer,
  getIndiaWatchProviders,
  MediaDetails,
  SimilarMedia,
  WatchProvider,
} from "@/services/api";

import {
  isSaved,
  removeMovie,
  saveMovie,
} from "@/services/saved";


const TMDB_IMAGE =
  "https://image.tmdb.org/t/p/";


export default function MovieDetailsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    id: string;
    mediaType?: string;
  }>();

  const user = useContext(UserContext);

  const id = params.id;

  const mediaType =
    params.mediaType === "tv"
      ? "tv"
      : "movie";


  const [media, setMedia] =
    useState<MediaDetails | null>(null);

  const [similar, setSimilar] =
    useState<SimilarMedia[]>([]);

  const [saved, setSaved] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [overviewExpanded, setOverviewExpanded] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | LOAD DETAILS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!id) return;

    loadDetails();
  }, [id, mediaType]);


  /*
  |--------------------------------------------------------------------------
  | CHECK POLARIS STATE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!user || !id) return;

    isSaved(user.$id, id)
      .then(setSaved)
      .catch((error) => {
        console.error(
          "POLARIS CHECK ERROR:",
          error
        );

        setSaved(false);
      });
  }, [user, id]);


  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  async function loadDetails() {
    try {
      setLoading(true);

      const [
        details,
        similarResults,
      ] = await Promise.all([
        fetchMediaDetailsFull(
          mediaType,
          id
        ),

        fetchSimilarMedia(
          mediaType,
          id
        ),
      ]);

      setMedia(details);

      setSimilar(
        similarResults.results || []
      );
    } catch (error) {
      console.error(
        "DETAILS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }


  /*
  |--------------------------------------------------------------------------
  | ADD TO POLARIS / REMOVE FROM POLARIS
  |--------------------------------------------------------------------------
  */

  async function togglePolaris() {
    if (!user || !media) return;

    try {
      if (saved) {
        await removeMovie(
          user.$id,
          media.id.toString()
        );

        setSaved(false);
      } else {
        await saveMovie(
          user.$id,
          media.id.toString()
        );

        setSaved(true);
      }
    } catch (error) {
      console.error(
        "POLARIS ACTION ERROR:",
        error
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | TRAILER
  |--------------------------------------------------------------------------
  */

  function openTrailer() {
    if (!media) return;

    const trailer =
      getOfficialTrailer(
        media.videos?.results
      );

    if (trailer?.key) {
      Linking.openURL(
        `https://www.youtube.com/watch?v=${trailer.key}`
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | OPEN SIMILAR
  |--------------------------------------------------------------------------
  */

  function openSimilar(
    item: SimilarMedia
  ) {
    router.push({
      pathname: "/movies/[id]",
      params: {
        id: item.id.toString(),
        mediaType: item.name
          ? "tv"
          : "movie",
      },
    });
  }


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
        />
      </View>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (!media) {
    return (
      <View style={styles.loading}>
        <PolarisText
          weight="semiBold"
          style={styles.errorText}
        >
          Unable to load this title.
        </PolarisText>

        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | MEDIA DATA
  |--------------------------------------------------------------------------
  */

  const title =
    media.title ||
    media.name ||
    "Untitled";


  const releaseDate =
    media.release_date ||
    media.first_air_date ||
    "";


  const year = releaseDate
    ? new Date(
        releaseDate
      ).getFullYear()
    : null;


  const runtime =
    mediaType === "tv"
      ? media.episode_run_time?.[0]
      : media.runtime;


  const runtimeText = runtime
    ? `${Math.floor(runtime / 60)}h ${
        runtime % 60
      }m`
    : null;


  const rating =
    typeof media.vote_average === "number"
      ? media.vote_average.toFixed(1)
      : null;


  const trailer =
    getOfficialTrailer(
      media.videos?.results
    );


  /*
  |--------------------------------------------------------------------------
  | WATCH PROVIDERS
  |--------------------------------------------------------------------------
  */

  const providers =
    getIndiaWatchProviders(
      media["watch/providers"]
    );


  /*
  |--------------------------------------------------------------------------
  | OVERVIEW
  |--------------------------------------------------------------------------
  */

  const overview =
    media.overview ||
    "No overview available.";


  const visibleOverview =
    overviewExpanded
      ? overview
      : overview.length > 180
        ? `${overview
            .slice(0, 180)
            .trim()}...`
        : overview;


  /*
  |--------------------------------------------------------------------------
  | CAST
  |--------------------------------------------------------------------------
  */

  const cast =
    media.credits?.cast?.slice(0, 10) ||
    [];


  /*
  |--------------------------------------------------------------------------
  | SCREEN
  |--------------------------------------------------------------------------
  */

  return (
    <View style={styles.container}>

      {/* BACKDROP */}

      <ImageBackground
        source={
          media.backdrop_path
            ? {
                uri: `${TMDB_IMAGE}original${media.backdrop_path}`,
              }
            : media.poster_path
              ? {
                  uri: `${TMDB_IMAGE}w780${media.poster_path}`,
                }
              : undefined
        }
        style={styles.background}
        blurRadius={8}
      >
        <LinearGradient
          colors={[
            "rgba(3,7,12,0.20)",
            "rgba(3,7,12,0.45)",
            "#0B0C0F",
          ]}
          locations={[
            0,
            0.48,
            1,
          ]}
          style={
            StyleSheet.absoluteFill
          }
        />
      </ImageBackground>


      {/* TOP CONTROLS */}

      <View style={styles.topControls}>

        <Pressable
          onPress={() => router.back()}
          style={styles.circleButton}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#FFFFFF"
          />
        </Pressable>


        <Pressable
          style={styles.circleButton}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={22}
            color="#FFFFFF"
          />
        </Pressable>

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* HERO */}

        <View style={styles.hero}>

          {media.poster_path && (
            <Image
              source={{
                uri: `${TMDB_IMAGE}w500${media.poster_path}`,
              }}
              style={styles.poster}
            />
          )}


          <View style={styles.heroInfo}>

            <PolarisText
              weight="bold"
              style={styles.title}
              numberOfLines={2}
            >
              {title}
            </PolarisText>


            <View style={styles.metaRow}>

              {year && (
                <PolarisText
                  weight="medium"
                  style={styles.metaText}
                >
                  {year}
                </PolarisText>
              )}


              {runtimeText && (
                <>
                  <View
                    style={styles.dot}
                  />

                  <PolarisText
                    weight="medium"
                    style={styles.metaText}
                  >
                    {runtimeText}
                  </PolarisText>
                </>
              )}


              {rating && (
                <>
                  <View
                    style={styles.dot}
                  />

                  <View
                    style={
                      styles.ratingInline
                    }
                  >
                    <Ionicons
                      name="star"
                      size={13}
                      color="#FFFFFF"
                    />

                    <PolarisText
                      weight="semiBold"
                      style={styles.metaText}
                    >
                      {rating}
                    </PolarisText>
                  </View>
                </>
              )}

            </View>


            {media.genres &&
              media.genres.length > 0 && (

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  contentContainerStyle={
                    styles.genreRow
                  }
                >

                  {media.genres
                    .slice(0, 4)
                    .map((genre) => (

                      <View
                        key={genre.id}
                        style={
                          styles.genrePill
                        }
                      >

                        <PolarisText
                          weight="medium"
                          style={
                            styles.genreText
                          }
                        >
                          {genre.name}
                        </PolarisText>

                      </View>

                    ))}

                </ScrollView>

              )}

          </View>

        </View>


        {/* ACTIONS */}

        <View style={styles.actions}>

          <Pressable
            onPress={openTrailer}
            disabled={!trailer}
            style={[
              styles.trailerButton,
              !trailer &&
                styles.disabledButton,
            ]}
          >

            <Ionicons
              name="play"
              size={18}
              color="#FFFFFF"
            />

            <PolarisText
              weight="semiBold"
              style={styles.trailerText}
            >
              Watch Trailer
            </PolarisText>

          </Pressable>


          <Pressable
            onPress={togglePolaris}
            style={[
              styles.polarisButton,
              saved &&
                styles.polarisButtonRemove,
            ]}
          >

            <Ionicons
              name={
                saved
                  ? "remove"
                  : "add"
              }
              size={20}
              color="#FFFFFF"
            />

            <PolarisText
              weight="semiBold"
              style={
                styles.polarisButtonText
              }
            >
              {saved
                ? "Remove from Polaris"
                : "Add to Polaris"}
            </PolarisText>

          </Pressable>

        </View>


        {/* OVERVIEW */}

        <View style={styles.section}>

          <PolarisText
            weight="semiBold"
            style={styles.sectionTitle}
          >
            Overview
          </PolarisText>


          <PolarisText
            style={styles.overview}
          >
            {visibleOverview}
          </PolarisText>


          {overview.length > 180 && (

            <Pressable
              onPress={() =>
                setOverviewExpanded(
                  (value) => !value
                )
              }
            >

              <PolarisText
                weight="semiBold"
                style={styles.readMore}
              >
                {overviewExpanded
                  ? "Show less"
                  : "Read more"}
              </PolarisText>

            </Pressable>

          )}

        </View>


        {/* CAST */}

        {cast.length > 0 && (

          <View style={styles.section}>

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
                Cast
              </PolarisText>


              <Pressable>
                <PolarisText
                  style={styles.seeAll}
                >
                  See all
                </PolarisText>
              </Pressable>

            </View>


            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.horizontalList
              }
            >

              {cast.map((person) => (

                <View
                  key={`${person.id}-${person.character}`}
                  style={styles.castCard}
                >

                  {person.profile_path ? (

                    <Image
                      source={{
                        uri: `${TMDB_IMAGE}w185${person.profile_path}`,
                      }}
                      style={
                        styles.castImage
                      }
                    />

                  ) : (

                    <View
                      style={
                        styles.castPlaceholder
                      }
                    >

                      <Ionicons
                        name="person"
                        size={26}
                        color="#68717C"
                      />

                    </View>

                  )}


                  <PolarisText
                    weight="semiBold"
                    style={
                      styles.castName
                    }
                    numberOfLines={1}
                  >
                    {person.name}
                  </PolarisText>


                  <PolarisText
                    style={
                      styles.character
                    }
                    numberOfLines={1}
                  >
                    {person.character ||
                      "Cast"}
                  </PolarisText>

                </View>

              ))}

            </ScrollView>

          </View>

        )}


        {/* WHERE TO WATCH */}

        {providers.length > 0 && (

          <View style={styles.section}>

            <PolarisText
              weight="semiBold"
              style={styles.sectionTitle}
            >
              Where to watch
            </PolarisText>


            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.horizontalList
              }
            >

              {providers.map(
                (provider: WatchProvider) => (

                  <View
                    key={
                      provider.provider_id
                    }
                    style={
                      styles.providerCard
                    }
                  >

                    {provider.logo_path && (

                      <Image
                        source={{
                          uri: `${TMDB_IMAGE}w92${provider.logo_path}`,
                        }}
                        style={
                          styles.providerLogo
                        }
                      />

                    )}


                    <PolarisText
                      weight="medium"
                      style={
                        styles.providerName
                      }
                      numberOfLines={1}
                    >
                      {
                        provider.provider_name
                      }
                    </PolarisText>

                  </View>

                )
              )}

            </ScrollView>


            <PolarisText
              style={styles.justWatch}
            >
              Streaming availability
              powered by JustWatch
            </PolarisText>

          </View>

        )}


        {/* SIMILAR */}

        {similar.length > 0 && (

          <View style={styles.section}>

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
                Similar
              </PolarisText>


              <Pressable>
                <PolarisText
                  style={styles.seeAll}
                >
                  See all
                </PolarisText>
              </Pressable>

            </View>


            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.horizontalList
              }
            >

              {similar
                .slice(0, 10)
                .map((item) => {

                  const itemTitle =
                    item.title ||
                    item.name ||
                    "Untitled";


                  return (

                    <Pressable
                      key={item.id}
                      onPress={() =>
                        openSimilar(
                          item
                        )
                      }
                      style={
                        styles.similarCard
                      }
                    >

                      {item.poster_path ? (

                        <Image
                          source={{
                            uri: `${TMDB_IMAGE}w342${item.poster_path}`,
                          }}
                          style={
                            styles.similarPoster
                          }
                        />

                      ) : (

                        <View
                          style={
                            styles.similarPlaceholder
                          }
                        />

                      )}


                      <LinearGradient
                        colors={[
                          "transparent",
                          "rgba(0,0,0,0.85)",
                        ]}
                        style={
                          styles.similarGradient
                        }
                      />


                      <PolarisText
                        weight="semiBold"
                        style={
                          styles.similarTitle
                        }
                        numberOfLines={2}
                      >
                        {itemTitle}
                      </PolarisText>

                    </Pressable>

                  );
                })}

            </ScrollView>

          </View>

        )}


        <View
          style={{
            height: 80,
          }}
        />

      </ScrollView>

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0B0C0F",
  },


  loading: {
    flex: 1,
    backgroundColor: "#0B0C0F",
    alignItems: "center",
    justifyContent: "center",
  },


  errorText: {
    color: "#FFFFFF",
    fontSize: 15,
  },


  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 620,
  },


  topControls: {
    position: "absolute",
    top: 54,
    left: 18,
    right: 18,
    zIndex: 10,

    flexDirection: "row",
    justifyContent: "space-between",
  },


  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(10,14,19,0.55)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.14)",
  },


  scrollContent: {
    paddingTop: 125,
    paddingHorizontal: 18,
  },


  hero: {
    flexDirection: "row",
    alignItems: "flex-end",
  },


  poster: {
    width: 142,
    height: 214,
    borderRadius: 18,
    backgroundColor: "#15191F",
  },


  heroInfo: {
    flex: 1,
    marginLeft: 16,
    paddingBottom: 2,
  },


  title: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: -0.7,
  },


  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },


  metaText: {
    color: "#D5DAE0",
    fontSize: 13,
  },


  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,

    backgroundColor: "#7C858F",

    marginHorizontal: 8,
  },


  ratingInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },


  genreRow: {
    gap: 6,
    marginTop: 12,
    paddingRight: 20,
  },


  genrePill: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,

    justifyContent: "center",

    backgroundColor:
      "rgba(13,18,24,0.78)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.10)",
  },


  genreText: {
    color: "#C5CCD5",
    fontSize: 11,
  },


  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },


  trailerButton: {
    height: 50,
    flex: 1,
    borderRadius: 25,

    backgroundColor:
      "rgba(19,25,33,0.84)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.14)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,
  },


  disabledButton: {
    opacity: 0.45,
  },


  trailerText: {
    color: "#FFFFFF",
    fontSize: 14,
  },


  polarisButton: {
    height: 50,
    flex: 1,
    borderRadius: 25,

    backgroundColor:
      "rgba(19,25,33,0.84)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.14)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },


  polarisButtonRemove: {
    backgroundColor:
      "rgba(255,255,255,0.06)",

    borderColor:
      "rgba(255,255,255,0.18)",
  },


  polarisButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
  },


  section: {
    marginTop: 30,
  },


  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,
  },


  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
  },


  seeAll: {
    color: "#9FA9B4",
    fontSize: 13,
  },


  overview: {
    color: "#AEB7C2",
    fontSize: 14,
    lineHeight: 22,
  },


  readMore: {
    color: "#DCEBFF",
    fontSize: 13,
    marginTop: 8,
  },


  horizontalList: {
    gap: 12,
    paddingRight: 20,
  },


  castCard: {
    width: 84,
  },


  castImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#151A20",
  },


  castPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,

    backgroundColor: "#151A20",

    alignItems: "center",
    justifyContent: "center",
  },


  castName: {
    color: "#E9EDF1",
    fontSize: 12,
    marginTop: 8,
  },


  character: {
    color: "#747F8B",
    fontSize: 11,
    marginTop: 3,
  },


  providerCard: {
    width: 90,
    alignItems: "center",
  },


  providerLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },


  providerName: {
    color: "#AEB7C2",
    fontSize: 11,
    marginTop: 7,
    textAlign: "center",
  },


  justWatch: {
    color: "#5F6974",
    fontSize: 9,
    marginTop: 10,
  },


  similarCard: {
    width: 125,
    height: 185,
    borderRadius: 15,

    overflow: "hidden",

    backgroundColor: "#151A20",
  },


  similarPoster: {
    width: "100%",
    height: "100%",
  },


  similarPlaceholder: {
    flex: 1,
    backgroundColor: "#151A20",
  },


  similarGradient: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: 80,
  },


  similarTitle: {
    position: "absolute",

    left: 10,
    right: 10,
    bottom: 10,

    color: "#FFFFFF",

    fontSize: 12,
    lineHeight: 15,
  },


  backButton: {
    marginTop: 20,

    width: 44,
    height: 44,
    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#151A20",
  },

});