--
-- PostgreSQL database dump
CREATE TABLE public.matches (
    id SERIAL PRIMARY KEY,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    userid1 integer,
    userid2 integer
);


--
-- TOC entry 212 (class 1259 OID 16842)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id SERIAL PRIMARY KEY,
    message character varying(255),
    matches_id integer NOT NULL,
    sender_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);



CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    pet_type character varying(255) DEFAULT 'dog'::character varying,
    image_pet character varying(255),
    pet_breeds character varying(255),
    gender character varying(255) DEFAULT 'male'::character varying,
    name character varying(255),
    age integer,
    city character varying(255),
    bio character varying(255)
);


--
-- TOC entry 3456 (class 2606 OID 16876)
-- Name: matches matches_userid1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_userid1_fkey FOREIGN KEY (userid1) REFERENCES public.users(id);


--
-- TOC entry 3457 (class 2606 OID 16881)
-- Name: matches matches_userid2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_userid2_fkey FOREIGN KEY (userid2) REFERENCES public.users(id);


--
-- TOC entry 3454 (class 2606 OID 16886)
-- Name: messages matchesid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT matchesid_fkey FOREIGN KEY (matches_id) REFERENCES public.matches(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3455 (class 2606 OID 16891)
-- Name: messages senderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT senderid_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
