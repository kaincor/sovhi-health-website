# Figma handoff drop

Paste Figma Dev Mode exports here as files instead of into chat — chat has a
50,000 character limit and the full-page frame is well past it. Files have no
limit and can be read in ranges.

## Convention

    design/<section>.txt     Dev Mode export for one section
    design/full-page.txt     the whole frame, if pasting it in one go
    design/text-styles.txt   the named text styles
    design/<section>.png     the reference render, if you have one

Use `.txt`, not `.jsx`. Figma's export is not valid JSX -- it emits
`style="..."` strings on spans -- so a `.jsx` extension makes the editor
underline the whole file in red. `.txt` reads fine and stays quiet. (`design/`
is also in the eslint ignore list, which handles the CLI side.)

Name sections after the frame or its heading, lowercased and hyphenated:

    design/hero.txt
    design/four-places-to-intervene.txt
    design/dream-team.txt
    design/footer.txt

Nothing here is served to the browser or bundled — it is reference material
only. (`public/` would be served; that is why this sits at the repo root.)

## Source of truth

Figma file: KKhoaZZLLln9CO999Tkzdn
Full-page frame: node 412-802

| section | frame node |
|---|---|
| 1 hero | 382-111 |
| 2 stats / upstream | 386-136 |

The node id is the `node-id=` value in a Figma URL. Sending it with each
section is useful: it goes in the component's doc comment, so anyone reading
the code later can open the exact frame it came from.
