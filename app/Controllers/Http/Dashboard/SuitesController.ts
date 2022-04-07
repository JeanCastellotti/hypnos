import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Suite from 'App/Models/Suite'
import SuiteValidator from 'App/Validators/SuiteValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'
import SuiteUpdateValidator from 'App/Validators/SuiteUpdateValidator'
import sharp from 'sharp'
import SuitesPicture from 'App/Models/SuitesPicture'

export default class SuitesController {
  public async index({ view, bouncer, auth }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewSuites')
    await auth.user!.load('establishment')
    const suites = await auth.user!.establishment?.related('suites').query()
    return view.render('dashboard/suites/index', { suites })
  }

  public async create({ view, response, session, auth, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('createSuite')
    const establishment = await auth.user!.related('establishment').query().first()

    if (!establishment) {
      session.flash(
        'error',
        "Vous n'avez pas encore la possibilité de créer une suite. Si le problème persiste, contactez l'administrateur."
      )
      return response.redirect().back()
    }

    return view.render('dashboard/suites/create')
  }

  public async store({ request, response, session, auth, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('storeSuite')
    const { picture1, picture2, ...data } = await request.validate(SuiteValidator)
    await auth.user!.load('establishment')

    try {
      const pictures = await SuitesPicture.createMany([
        {
          filename: string.generateRandom(32),
          extname: picture1.extname,
        },
        {
          filename: string.generateRandom(32),
          extname: picture2.extname,
        },
      ])

      await Suite.create({
        ...data,
        establishmentId: auth.user!.establishment.id,
        picture_1: pictures[0].id,
        picture_2: pictures[1].id,
      })

      const resizePicture1Large = await sharp(picture1.tmpPath).resize(1280).toBuffer()
      const resizePicture1Small = await sharp(picture1.tmpPath).resize(640).toBuffer()
      const resizePicture2Large = await sharp(picture2.tmpPath).resize(1280).toBuffer()
      const resizePicture2Small = await sharp(picture2.tmpPath).resize(640).toBuffer()

      await Drive.put(`${pictures[0].filename}-lg.${pictures[0].extname}`, resizePicture1Large)
      await Drive.put(`${pictures[0].filename}-sm.${pictures[0].extname}`, resizePicture1Small)
      await Drive.put(`${pictures[1].filename}-lg.${pictures[1].extname}`, resizePicture2Large)
      await Drive.put(`${pictures[1].filename}-sm.${pictures[1].extname}`, resizePicture2Small)
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la création de la suite')
      return response.redirect().back()
    }

    session.flash('success', 'La suite a bien été créée')
    return response.redirect().toRoute('dashboard.suites.index')
  }

  public async edit({ params, view, bouncer }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.id)

    await bouncer.with('DashboardPolicy').authorize('editSuite', suite)

    return view.render('dashboard/suites/edit', { suite })
  }

  public async update({ request, response, params, session, bouncer }: HttpContextContract) {
    const { picture1, picture2, ...data } = await request.validate(SuiteUpdateValidator)
    const suite = await Suite.findOrFail(params.id)
    await bouncer.with('DashboardPolicy').authorize('updateSuite', suite)

    try {
      if (picture1) {
        await suite.load('picture1')

        await Drive.delete(`${suite.picture1.filename}-sm.${suite.picture1.extname}`)
        await Drive.delete(`${suite.picture1.filename}-lg.${suite.picture1.extname}`)

        const resizePictureLarge = await sharp(picture1.tmpPath).resize(1280).toBuffer()
        const resizePictureSmall = await sharp(picture1.tmpPath).resize(640).toBuffer()

        const filename = string.generateRandom(32)

        await Drive.put(`${filename}-sm.${picture1.extname}`, resizePictureSmall)
        await Drive.put(`${filename}-lg.${picture1.extname}`, resizePictureLarge)

        suite.picture1.merge({ filename, extname: picture1.extname }).save()
      }

      if (picture2) {
        await suite.load('picture2')

        await Drive.delete(`${suite.picture2.filename}-sm.${suite.picture2.extname}`)
        await Drive.delete(`${suite.picture2.filename}-lg.${suite.picture2.extname}`)

        const resizePictureLarge = await sharp(picture2.tmpPath).resize(1280).toBuffer()
        const resizePictureSmall = await sharp(picture2.tmpPath).resize(640).toBuffer()

        const filename = string.generateRandom(32)

        await Drive.put(`${filename}-sm.${picture2.extname}`, resizePictureSmall)
        await Drive.put(`${filename}-lg.${picture2.extname}`, resizePictureLarge)

        suite.picture2.merge({ filename, extname: picture2.extname }).save()
      }

      await suite.merge({ ...data }).save()
    } catch (error) {
      console.log(error)

      session.flash('error', 'Un problème est survenu lors de la modification de la suite')
      return response.redirect().back()
    }

    session.flash('success', 'La suite a bien été modifiée')
    return response.redirect().toRoute('dashboard.suites.index')
  }

  public async delete({ params, view, bouncer }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.id)

    await bouncer.with('DashboardPolicy').authorize('deleteSuite', suite)

    return view.render('dashboard/suites/delete', { suite })
  }

  public async destroy({ params, response, session, bouncer }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.id)

    await bouncer.with('DashboardPolicy').authorize('destroySuite', suite)

    try {
      await suite.delete()
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la suppression de la suite')
      return response.redirect().back()
    }

    session.flash('success', 'La suite a bien été supprimée')
    return response.redirect().toRoute('dashboard.suites.index')
  }
}
