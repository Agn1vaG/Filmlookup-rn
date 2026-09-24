import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import MovieCard from "@/components/MovieCard";

type Movie = {
  id: number;
  poster_path: string | null;
  title?: string;
  name?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

type PolarisMovieStackProps = {
  movies: Movie[];
  onSwipeRight?: (movie: Movie) => void;
  onSwipeLeft?: (movie: Movie) => void;
};

const CARD_WIDTH = 390;
const CARD_HEIGHT = 630;

const SWIPE_THRESHOLD = 120;
const SWIPE_OUT_DISTANCE = 500;

const VERTICAL_SWIPE_THRESHOLD = 120;

const GESTURE_DIRECTION_THRESHOLD = 12;

const DECK_SIZE = 4;

export default function PolarisMovieStack({
  movies,
  onSwipeRight,
  onSwipeLeft,
}: PolarisMovieStackProps) {
  const router = useRouter();

  /*
  |--------------------------------------------------------------------------
  | MOVIE DECK
  |--------------------------------------------------------------------------
  */

  const [deck, setDeck] = useState<Movie[]>([]);

  const nextMovieIndex = useRef(0);

  /*
  |--------------------------------------------------------------------------
  | LIVE STATE REFS
  |--------------------------------------------------------------------------
  |
  | PanResponder is created once.
  | These refs make sure it always sees the latest data.
  |
  */

  const deckRef = useRef<Movie[]>([]);
  const moviesRef = useRef<Movie[]>(movies);

  /*
  |--------------------------------------------------------------------------
  | THREE PERMANENT CARD LAYERS
  |--------------------------------------------------------------------------
  */

  const frontPosition = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;

  const secondProgress = useRef(
    new Animated.Value(0)
  ).current;

  const thirdProgress = useRef(
    new Animated.Value(0)
  ).current;

  const isAnimating = useRef(false);

  /*
  |--------------------------------------------------------------------------
  | GESTURE DIRECTION
  |--------------------------------------------------------------------------
  */

  const gestureDirection = useRef<
    "horizontal" | "vertical" | null
  >(null);

  /*
  |--------------------------------------------------------------------------
  | KEEP REFS UPDATED
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    moviesRef.current = movies;
  }, [movies]);

  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);

  /*
  |--------------------------------------------------------------------------
  | INITIAL MOVIE DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (movies.length === 0) {
      return;
    }

    if (deck.length === 0) {
      const initialDeck = movies.slice(0, DECK_SIZE);

      deckRef.current = initialDeck;

      setDeck(initialDeck);

      nextMovieIndex.current = initialDeck.length;
    }
  }, [movies, deck.length]);

  /*
  |--------------------------------------------------------------------------
  | CURRENT MOVIES
  |--------------------------------------------------------------------------
  */

  const currentMovie = deck[0];
  const secondMovie = deck[1];
  const thirdMovie = deck[2];

  /*
  |--------------------------------------------------------------------------
  | FRONT CARD
  |--------------------------------------------------------------------------
  */

  const rotate = frontPosition.x.interpolate({
    inputRange: [-CARD_WIDTH, 0, CARD_WIDTH],
    outputRange: ["-8deg", "0deg", "8deg"],
    extrapolate: "clamp",
  });

  const currentCardScale = frontPosition.x.interpolate({
    inputRange: [
      -SWIPE_OUT_DISTANCE,
      -120,
      0,
      120,
      SWIPE_OUT_DISTANCE,
    ],
    outputRange: [
      0.96,
      0.99,
      1,
      0.99,
      0.96,
    ],
    extrapolate: "clamp",
  });

  /*
  |--------------------------------------------------------------------------
  | SWIPE LABELS
  |--------------------------------------------------------------------------
  */

  const rightLabelOpacity =
    frontPosition.x.interpolate({
      inputRange: [0, 35, 80, 120],
      outputRange: [0, 0.15, 0.65, 1],
      extrapolate: "clamp",
    });

  const leftLabelOpacity =
    frontPosition.x.interpolate({
      inputRange: [-120, -80, -35, 0],
      outputRange: [1, 0.65, 0.15, 0],
      extrapolate: "clamp",
    });

  const rightLabelTranslateX =
    frontPosition.x.interpolate({
      inputRange: [0, 40, 120],
      outputRange: [0, -55, -130],
      extrapolate: "clamp",
    });

  const leftLabelTranslateX =
    frontPosition.x.interpolate({
      inputRange: [-120, -40, 0],
      outputRange: [130, 55, 0],
      extrapolate: "clamp",
    });

  /*
  |--------------------------------------------------------------------------
  | SECOND CARD
  |--------------------------------------------------------------------------
  */

  const secondTranslateY =
    secondProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 0],
      extrapolate: "clamp",
    });

  const secondScale =
    secondProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.97, 1],
      extrapolate: "clamp",
    });

  /*
  |--------------------------------------------------------------------------
  | THIRD CARD
  |--------------------------------------------------------------------------
  */

  const thirdTranslateY =
    thirdProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [28, 14],
      extrapolate: "clamp",
    });

  const thirdScale =
    thirdProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.94, 0.97],
      extrapolate: "clamp",
    });

  /*
  |--------------------------------------------------------------------------
  | RESET GESTURE
  |--------------------------------------------------------------------------
  */

  const resetGesture = () => {
    gestureDirection.current = null;
  };

  /*
  |--------------------------------------------------------------------------
  | SWIPE CARD
  |--------------------------------------------------------------------------
  */

  const swipeCard = (
    direction: "left" | "right"
  ) => {
    if (isAnimating.current) {
      return;
    }

    const currentDeck = deckRef.current;

    const movieBeingSwiped = currentDeck[0];
    const secondMovieNow = currentDeck[1];
    const thirdMovieNow = currentDeck[2];

    if (
      !movieBeingSwiped ||
      !secondMovieNow ||
      !thirdMovieNow
    ) {
      return;
    }

    isAnimating.current = true;

    const destination =
      direction === "right"
        ? SWIPE_OUT_DISTANCE
        : -SWIPE_OUT_DISTANCE;

    secondProgress.setValue(0);
    thirdProgress.setValue(0);

    Animated.parallel([
      /*
      |--------------------------------------------------------------------------
      | FRONT → OUT
      |--------------------------------------------------------------------------
      */

      Animated.timing(frontPosition, {
        toValue: {
          x: destination,
          y: 30,
        },
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      /*
      |--------------------------------------------------------------------------
      | SECOND → FRONT
      |--------------------------------------------------------------------------
      */

      Animated.timing(secondProgress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      /*
      |--------------------------------------------------------------------------
      | THIRD → SECOND
      |--------------------------------------------------------------------------
      */

      Animated.timing(thirdProgress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        isAnimating.current = false;
        resetGesture();
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | REGISTER SWIPE
      |--------------------------------------------------------------------------
      */

      if (direction === "right") {
        onSwipeRight?.(movieBeingSwiped);
      } else {
        onSwipeLeft?.(movieBeingSwiped);
      }

      /*
      |--------------------------------------------------------------------------
      | GET NEXT MOVIE
      |--------------------------------------------------------------------------
      */

      const currentMovies = moviesRef.current;

      const nextMovie =
        currentMovies[nextMovieIndex.current];

      const newDeck = [
        secondMovieNow,
        thirdMovieNow,
        currentDeck[3],
        nextMovie,
      ].filter(Boolean) as Movie[];

      /*
      |--------------------------------------------------------------------------
      | RESET FRONT
      |--------------------------------------------------------------------------
      */

      frontPosition.setValue({
        x: 0,
        y: 0,
      });

      secondProgress.setValue(0);
      thirdProgress.setValue(0);

      if (nextMovie) {
        nextMovieIndex.current += 1;
      }

      /*
      |--------------------------------------------------------------------------
      | UPDATE DECK + REF TOGETHER
      |--------------------------------------------------------------------------
      */

      deckRef.current = newDeck;

      setDeck(newDeck);

      resetGesture();

      isAnimating.current = false;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN MOVIE DETAILS
  |--------------------------------------------------------------------------
  */

  const openMovieDetails = () => {
    if (isAnimating.current) {
      return;
    }

    const movie = deckRef.current[0];

    if (!movie) {
      return;
    }

    isAnimating.current = true;

    /*
    |--------------------------------------------------------------------------
    | MOVE CARD UP
    |--------------------------------------------------------------------------
    */

    Animated.timing(frontPosition, {
      toValue: {
        x: 0,
        y: -CARD_HEIGHT,
      },
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        frontPosition.setValue({
          x: 0,
          y: 0,
        });

        resetGesture();
        isAnimating.current = false;
        return;
      }

      router.push({
        pathname: "/movies/[id]",
        params: {
          id: movie.id.toString(),
        },
      });

      /*
      |--------------------------------------------------------------------------
      | RESET CARD FOR WHEN USER RETURNS
      |--------------------------------------------------------------------------
      */

      frontPosition.setValue({
        x: 0,
        y: 0,
      });

      resetGesture();

      isAnimating.current = false;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | PAN RESPONDER
  |--------------------------------------------------------------------------
  */

  const panResponder = useRef(
    PanResponder.create({
      /*
      |--------------------------------------------------------------------------
      | DON'T GRAB TOUCH IMMEDIATELY
      |--------------------------------------------------------------------------
      */

      onStartShouldSetPanResponder: () => false,

      /*
      |--------------------------------------------------------------------------
      | DETERMINE GESTURE DIRECTION
      |--------------------------------------------------------------------------
      */

      onMoveShouldSetPanResponder: (_, gesture) => {
        if (isAnimating.current) {
          return false;
        }

        const absX = Math.abs(gesture.dx);
        const absY = Math.abs(gesture.dy);

        if (
          absX < GESTURE_DIRECTION_THRESHOLD &&
          absY < GESTURE_DIRECTION_THRESHOLD
        ) {
          return false;
        }

        /*
        |--------------------------------------------------------------------------
        | ONLY UPWARD VERTICAL GESTURES
        |--------------------------------------------------------------------------
        */

        if (absY > absX) {
          if (gesture.dy >= 0) {
            return false;
          }

          gestureDirection.current = "vertical";

          return true;
        }

        /*
        |--------------------------------------------------------------------------
        | HORIZONTAL GESTURE
        |--------------------------------------------------------------------------
        */

        gestureDirection.current = "horizontal";

        return true;
      },

      /*
      |--------------------------------------------------------------------------
      | MOVE
      |--------------------------------------------------------------------------
      */

      onPanResponderMove: (_, gesture) => {
        if (isAnimating.current) {
          return;
        }

        if (
          gestureDirection.current ===
          "horizontal"
        ) {
          frontPosition.setValue({
            x: gesture.dx,
            y: 0,
          });

          return;
        }

        if (
          gestureDirection.current ===
          "vertical"
        ) {
          const upwardY = Math.min(
            gesture.dy,
            0
          );

          frontPosition.setValue({
            x: 0,
            y: upwardY,
          });
        }
      },

      /*
      |--------------------------------------------------------------------------
      | RELEASE
      |--------------------------------------------------------------------------
      */

      onPanResponderRelease: (_, gesture) => {
        if (isAnimating.current) {
          return;
        }

        const direction =
          gestureDirection.current;

        /*
        |--------------------------------------------------------------------------
        | UP → DETAILS
        |--------------------------------------------------------------------------
        */

        if (
          direction === "vertical" &&
          gesture.dy <
            -VERTICAL_SWIPE_THRESHOLD
        ) {
          openMovieDetails();
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | LEFT / RIGHT
        |--------------------------------------------------------------------------
        */

        if (
          direction === "horizontal"
        ) {
          if (
            gesture.dx >
            SWIPE_THRESHOLD
          ) {
            swipeCard("right");
            return;
          }

          if (
            gesture.dx <
            -SWIPE_THRESHOLD
          ) {
            swipeCard("left");
            return;
          }
        }

        /*
        |--------------------------------------------------------------------------
        | NOT ENOUGH → SNAP BACK
        |--------------------------------------------------------------------------
        */

        Animated.spring(
          frontPosition,
          {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: true,
            friction: 7,
            tension: 45,
          }
        ).start(() => {
          resetGesture();
        });
      },

      /*
      |--------------------------------------------------------------------------
      | CANCELLED
      |--------------------------------------------------------------------------
      */

      onPanResponderTerminate: () => {
        if (isAnimating.current) {
          return;
        }

        Animated.spring(
          frontPosition,
          {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: true,
            friction: 7,
            tension: 45,
          }
        ).start(() => {
          resetGesture();
        });
      },

      onPanResponderTerminationRequest:
        () => false,
    })
  ).current;

  /*
  |--------------------------------------------------------------------------
  | EMPTY STATE
  |--------------------------------------------------------------------------
  */

  if (!currentMovie) {
    return (
      <View
        style={[
          styles.emptyState,
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          },
        ]}
      >
        <Text style={styles.emptyTitle}>
          {movies.length === 0
            ? "Finding your movies..."
            : "You've reached the end"}
        </Text>

        <Text style={styles.emptyText}>
          {movies.length === 0
            ? "Building your Polaris."
            : "More movies coming soon."}
        </Text>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DECK
  |--------------------------------------------------------------------------
  */

  return (
    <View
      style={[
        styles.container,
        {
          width: CARD_WIDTH,
          height: CARD_HEIGHT + 70,
        },
      ]}
    >
      {/*
      |--------------------------------------------------------------------------
      | THIRD
      |--------------------------------------------------------------------------
      */}

      {thirdMovie && (
        <Animated.View
          key="polaris-card-third"
          pointerEvents="none"
          style={[
            styles.card,
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              opacity: 0.9,
              zIndex: 1,
              transform: [
                {
                  translateY:
                    thirdTranslateY,
                },
                {
                  scale: thirdScale,
                },
              ],
            },
          ]}
        >
          <MovieCard
            id={thirdMovie.id}
            poster_path={
              thirdMovie.poster_path
            }
            title={thirdMovie.title}
            name={thirdMovie.name}
            vote_average={
              thirdMovie.vote_average
            }
            release_date={
              thirdMovie.release_date
            }
            first_air_date={
              thirdMovie.first_air_date
            }
          />
        </Animated.View>
      )}

      {/*
      |--------------------------------------------------------------------------
      | SECOND
      |--------------------------------------------------------------------------
      */}

      {secondMovie && (
        <Animated.View
          key="polaris-card-second"
          pointerEvents="none"
          style={[
            styles.card,
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              opacity: 1,
              zIndex: 2,
              transform: [
                {
                  translateY:
                    secondTranslateY,
                },
                {
                  scale: secondScale,
                },
              ],
            },
          ]}
        >
          <MovieCard
            id={secondMovie.id}
            poster_path={
              secondMovie.poster_path
            }
            title={secondMovie.title}
            name={secondMovie.name}
            vote_average={
              secondMovie.vote_average
            }
            release_date={
              secondMovie.release_date
            }
            first_air_date={
              secondMovie.first_air_date
            }
          />
        </Animated.View>
      )}

      {/*
      |--------------------------------------------------------------------------
      | FRONT
      |--------------------------------------------------------------------------
      */}

      <Animated.View
        key="polaris-card-front"
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            zIndex: 3,
            transform: [
              {
                translateX:
                  frontPosition.x,
              },
              {
                translateY:
                  frontPosition.y,
              },
              {
                rotate,
              },
              {
                scale: currentCardScale,
              },
            ],
          },
        ]}
      >
        {/*
        |--------------------------------------------------------------------------
        | ADD TO POLARIS
        |--------------------------------------------------------------------------
        */}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.actionLabel,
            styles.rightAction,
            {
              opacity:
                rightLabelOpacity,
              transform: [
                {
                  translateX:
                    rightLabelTranslateX,
                },
              ],
            },
          ]}
        >
          <Text style={styles.actionText}>
            ADD TO POLARIS
          </Text>
        </Animated.View>

        {/*
        |--------------------------------------------------------------------------
        | IGNORE
        |--------------------------------------------------------------------------
        */}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.actionLabel,
            styles.leftAction,
            {
              opacity:
                leftLabelOpacity,
              transform: [
                {
                  translateX:
                    leftLabelTranslateX,
                },
              ],
            },
          ]}
        >
          <Text style={styles.actionText}>
            IGNORE
          </Text>
        </Animated.View>

        <MovieCard
          id={currentMovie.id}
          poster_path={
            currentMovie.poster_path
          }
          title={currentMovie.title}
          name={currentMovie.name}
          vote_average={
            currentMovie.vote_average
          }
          release_date={
            currentMovie.release_date
          }
          first_air_date={
            currentMovie.first_air_date
          }
        />
      </Animated.View>
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
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  card: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  /*
  |--------------------------------------------------------------------------
  | SWIPE ACTION LABELS
  |--------------------------------------------------------------------------
  */

  actionLabel: {
    position: "absolute",
    top: 28,
    minWidth: 150,
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 1.2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  rightAction: {
    right: 18,
    backgroundColor:
      "rgba(70,200,120,0.18)",
    borderColor:
      "rgba(80,220,140,0.65)",
  },

  leftAction: {
    left: 18,
    backgroundColor:
      "rgba(230,70,80,0.18)",
    borderColor:
      "rgba(245,80,90,0.65)",
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.15,
  },

  /*
  |--------------------------------------------------------------------------
  | EMPTY STATE
  |--------------------------------------------------------------------------
  */

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    color: "#F4F7FA",
    fontSize: 18,
    fontWeight: "600",
  },

  emptyText: {
    color: "#7E8997",
    fontSize: 13,
    marginTop: 8,
  },
});