import React, { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";

import Tmdb from "./Tmdb";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista total
      let list = await Tmdb.getHomeList();
      console.log(list);
      setMovieList(list);

      // Pegando o featured
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      console.log(randomChosen);
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");

      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featuredData && <FeaturedMovie item={featuredData} />}
      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow
            key={key}
            title={item.title}
            items={item.items}
            alt={item.original_title}
          />
        ))}
      </section>

      {movieList <= 0 && (
        <div className="loading">
          <img
            src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif?x48937"
            alt="loading"
          ></img>
        </div>
      )}

      <footer>
        Feito com{" "}
        <span role="img" aria-label="coração">
          💖
        </span>{" "}
        por mleitejunior
        <br />
        Direitos de imagem pela Netflix
        <br />
        Dados pegos do site TheMovieDatabase.org
        <br />
        Aula de Bonieky Lacerda
      </footer>
    </div>
  );
};
